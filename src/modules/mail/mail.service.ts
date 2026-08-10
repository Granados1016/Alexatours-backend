import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Configuracion } from '../configuracion/configuracion.entity';

interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  mailTo: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;
  private currentMailTo = '';

  constructor(
    private config: ConfigService,
    @InjectRepository(Configuracion)
    private readonly cfgRepo: Repository<Configuracion>,
  ) {}

  // ── Config desde BD ────────────────────────────────────────────────────────

  private async loadSmtpFromDb(): Promise<SmtpConfig | null> {
    const rows = await this.cfgRepo.find({ where: [
      { clave: 'smtp_host' }, { clave: 'smtp_port' }, { clave: 'smtp_secure' },
      { clave: 'smtp_user' }, { clave: 'smtp_pass' }, { clave: 'smtp_mail_to' },
    ]});
    const map = Object.fromEntries(rows.map((r) => [r.clave, r.valor ?? '']));

    if (!map['smtp_host'] || !map['smtp_user'] || !map['smtp_pass']) return null;

    return {
      host: map['smtp_host'],
      port: Number(map['smtp_port'] || '587'),
      secure: map['smtp_secure'] === 'true',
      user: map['smtp_user'],
      pass: map['smtp_pass'],
      mailTo: map['smtp_mail_to'] || map['smtp_user'],
    };
  }

  private async getTransporter(): Promise<nodemailer.Transporter | null> {
    const dbCfg = await this.loadSmtpFromDb();

    if (dbCfg) {
      this.currentMailTo = dbCfg.mailTo;
      return nodemailer.createTransport({
        host: dbCfg.host,
        port: dbCfg.port,
        secure: dbCfg.secure,
        auth: { user: dbCfg.user, pass: dbCfg.pass },
      });
    }

    // Fallback a .env
    const host = this.config.get('MAIL_HOST');
    const user = this.config.get('MAIL_USER');
    const pass = this.config.get('MAIL_PASS');
    if (!host || !user || !pass) return null;

    this.currentMailTo = this.config.get('MAIL_TO', user as string) as string;
    return nodemailer.createTransport({
      host,
      port: Number(this.config.get('MAIL_PORT', '587')),
      secure: this.config.get('MAIL_SECURE', 'false') === 'true',
      auth: { user, pass },
    });
  }

  // ── Endpoints admin ────────────────────────────────────────────────────────

  async getSmtpConfig() {
    const rows = await this.cfgRepo.find({ where: [
      { clave: 'smtp_host' }, { clave: 'smtp_port' }, { clave: 'smtp_secure' },
      { clave: 'smtp_user' }, { clave: 'smtp_mail_to' },
    ]});
    const map = Object.fromEntries(rows.map((r) => [r.clave, r.valor ?? '']));
    return {
      host: map['smtp_host'] || '',
      port: Number(map['smtp_port'] || 587),
      secure: map['smtp_secure'] === 'true',
      user: map['smtp_user'] || '',
      hasPass: !!(await this.cfgRepo.findOne({ where: { clave: 'smtp_pass' } }))?.valor,
      mailTo: map['smtp_mail_to'] || '',
    };
  }

  async saveSmtpConfig(data: {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass?: string;
    mailTo: string;
  }) {
    const upsert = async (clave: string, valor: string) => {
      const existing = await this.cfgRepo.findOne({ where: { clave } });
      if (existing) {
        await this.cfgRepo.update({ clave }, { valor });
      } else {
        await this.cfgRepo.save(
          this.cfgRepo.create({ clave, valor, grupo: 'correo', etiqueta: clave, tipo: 'text' }),
        );
      }
    };

    await upsert('smtp_host', data.host);
    await upsert('smtp_port', String(data.port));
    await upsert('smtp_secure', String(data.secure));
    await upsert('smtp_user', data.user);
    await upsert('smtp_mail_to', data.mailTo);
    if (data.pass) await upsert('smtp_pass', data.pass);
  }

  async enviarCorreoPrueba(to: string) {
    const transport = await this.getTransporter();
    if (!transport) throw new Error('SMTP no configurado');

    const info = await transport.sendMail({
      from: `"Alexa Tours" <${(await this.loadSmtpFromDb())?.user || this.config.get('MAIL_USER')}>`,
      to,
      subject: '✅ Correo de prueba — Alexa Tours',
      html: `
        <div style="font-family:sans-serif;max-width:500px;margin:0 auto;">
          <div style="background:#0A5D8F;padding:24px;border-radius:12px 12px 0 0;text-align:center;">
            <h1 style="color:white;margin:0;font-size:20px;">Alexa Tours</h1>
          </div>
          <div style="background:#f9f9f9;padding:24px;border-radius:0 0 12px 12px;">
            <p style="margin:0;color:#333;font-size:15px;">
              ¡La configuración de correo funciona correctamente! 🎉<br><br>
              Si recibes este mensaje, el servidor SMTP está configurado bien.
            </p>
            <p style="margin:20px 0 0;color:#888;font-size:12px;">
              Enviado desde el panel admin de Alexa Tours.
            </p>
          </div>
        </div>
      `,
    });
    this.logger.log(`Correo de prueba enviado: ${info.messageId}`);
  }

  // ── Métodos de envío ───────────────────────────────────────────────────────

  async enviarNotificacionContacto(datos: {
    nombre: string;
    email: string;
    telefono?: string;
    mensaje?: string;
  }) {
    const transport = await this.getTransporter();
    if (!transport) return;
    const from = `"Alexa Tours Web" <${(await this.loadSmtpFromDb())?.user || this.config.get('MAIL_USER')}>`;

    try {
      await transport.sendMail({
        from,
        to: this.currentMailTo,
        subject: `📧 Nuevo mensaje de ${datos.nombre}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
            <div style="background:#0A5D8F;padding:24px;border-radius:12px 12px 0 0;">
              <h1 style="color:white;margin:0;font-size:20px;">Nuevo mensaje de contacto</h1>
            </div>
            <div style="background:#f9f9f9;padding:24px;border-radius:0 0 12px 12px;">
              <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:8px 0;font-weight:bold;color:#555;width:120px;">Nombre:</td><td style="padding:8px 0;">${datos.nombre}</td></tr>
                <tr><td style="padding:8px 0;font-weight:bold;color:#555;">Email:</td><td style="padding:8px 0;"><a href="mailto:${datos.email}">${datos.email || '—'}</a></td></tr>
                <tr><td style="padding:8px 0;font-weight:bold;color:#555;">Teléfono:</td><td style="padding:8px 0;">${datos.telefono || '—'}</td></tr>
                <tr><td style="padding:8px 0;font-weight:bold;color:#555;vertical-align:top;">Mensaje:</td><td style="padding:8px 0;">${datos.mensaje || '—'}</td></tr>
              </table>
              <div style="margin-top:20px;padding-top:20px;border-top:1px solid #e0e0e0;">
                <a href="${this.config.get('NEXT_PUBLIC_URL', 'http://localhost:3001')}/admin/mensajes"
                   style="background:#0E84C7;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:bold;">
                  Ver en el admin
                </a>
              </div>
            </div>
          </div>
        `,
      });
      this.logger.log(`Email de contacto enviado: ${datos.nombre}`);
    } catch (err) {
      this.logger.error('Error enviando email de contacto', err);
    }
  }

  async enviarConfirmacionCliente(datos: {
    nombre: string;
    email: string;
    paquete: string;
    fechaViaje: string;
    numPersonas: number;
    total: number;
    reservaId: number;
  }) {
    const transport = await this.getTransporter();
    if (!transport || !datos.email) return;
    const from = `"Alexa Tours" <${(await this.loadSmtpFromDb())?.user || this.config.get('MAIL_USER')}>`;
    const siteUrl = this.config.get('NEXT_PUBLIC_URL', 'http://localhost:3001');
    const waNumero = this.config.get('WHATSAPP_NUMERO', '52995305412');

    try {
      await transport.sendMail({
        from,
        to: datos.email,
        subject: `✅ Confirmamos tu reserva — ${datos.paquete}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#F8F3E8;">
            <div style="background:#0A5D8F;padding:32px 24px;border-radius:16px 16px 0 0;text-align:center;">
              <h1 style="color:white;margin:0;font-size:24px;font-weight:bold;">Alexa Tours</h1>
              <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px;">Viajes para Recordar ✈️</p>
            </div>
            <div style="background:white;padding:32px 24px;">
              <h2 style="color:#0A5D8F;margin:0 0 8px;">¡Hola, ${datos.nombre}!</h2>
              <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 24px;">
                Hemos recibido tu solicitud de reserva. Uno de nuestros asesores te contactará en las próximas <strong>24 horas</strong> para confirmar los detalles y coordinar el pago del anticipo.
              </p>
              <div style="background:#F8F3E8;border-radius:12px;padding:20px;margin-bottom:24px;">
                <h3 style="color:#0A5D8F;margin:0 0 16px;font-size:16px;">📋 Resumen de tu reserva</h3>
                <table style="width:100%;border-collapse:collapse;font-size:14px;">
                  <tr><td style="padding:6px 0;color:#888;width:130px;">N° de reserva:</td><td style="padding:6px 0;font-weight:bold;color:#0A5D8F;">#${datos.reservaId}</td></tr>
                  <tr><td style="padding:6px 0;color:#888;">Paquete:</td><td style="padding:6px 0;font-weight:bold;">${datos.paquete}</td></tr>
                  <tr><td style="padding:6px 0;color:#888;">Fecha de viaje:</td><td style="padding:6px 0;">${datos.fechaViaje || 'Por confirmar'}</td></tr>
                  <tr><td style="padding:6px 0;color:#888;">Personas:</td><td style="padding:6px 0;">${datos.numPersonas}</td></tr>
                  <tr><td style="padding:6px 0;color:#888;">Total estimado:</td><td style="padding:6px 0;font-weight:bold;color:#0E84C7;font-size:18px;">$${Number(datos.total).toLocaleString('es-MX')} MXN</td></tr>
                </table>
              </div>
              <h3 style="color:#0A5D8F;margin:0 0 12px;font-size:16px;">📌 Próximos pasos</h3>
              <ol style="color:#555;font-size:14px;line-height:2;padding-left:20px;margin:0 0 24px;">
                <li>Nuestro asesor te contactará por WhatsApp o email</li>
                <li>Confirmaremos disponibilidad y detalles del paquete</li>
                <li>Realizas el pago del anticipo para asegurar tu lugar</li>
                <li>¡Listo! Te enviamos tu itinerario completo</li>
              </ol>
              <div style="text-align:center;margin-bottom:24px;">
                <a href="https://wa.me/${waNumero}?text=${encodeURIComponent(`Hola! Soy ${datos.nombre}, acabo de hacer una reserva #${datos.reservaId} para el paquete ${datos.paquete}. ¿Podrían confirmarla?`)}"
                   style="background:#25D366;color:white;padding:14px 28px;border-radius:50px;text-decoration:none;font-weight:bold;font-size:15px;display:inline-block;">
                  💬 Contactar a mi asesor por WhatsApp
                </a>
              </div>
              <p style="color:#888;font-size:12px;text-align:center;margin:0;">
                Si tienes dudas también puedes escribirnos a
                <a href="mailto:hola@alexatours.mx" style="color:#0E84C7;">hola@alexatours.mx</a>
              </p>
            </div>
            <div style="background:#F8F3E8;padding:20px 24px;border-radius:0 0 16px 16px;text-align:center;">
              <p style="color:#aaa;font-size:11px;margin:0;">
                Alexa Tours — Agencia de viajes en Mérida, Yucatán, México<br>
                Este correo es una confirmación automática de tu solicitud.
              </p>
            </div>
          </div>
        `,
      });
      this.logger.log(`Email de confirmación enviado al cliente: ${datos.email}`);
    } catch (err) {
      this.logger.error('Error enviando email de confirmación al cliente', err);
    }
  }

  async enviarNotificacionReserva(datos: {
    nombre: string;
    email: string;
    paquete: string;
    fechaViaje: string;
    numPersonas: number;
    total: number;
  }) {
    const transport = await this.getTransporter();
    if (!transport) return;
    const from = `"Alexa Tours Web" <${(await this.loadSmtpFromDb())?.user || this.config.get('MAIL_USER')}>`;

    try {
      await transport.sendMail({
        from,
        to: this.currentMailTo,
        subject: `🧳 Nueva reserva de ${datos.nombre} — ${datos.paquete}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
            <div style="background:#0A5D8F;padding:24px;border-radius:12px 12px 0 0;">
              <h1 style="color:white;margin:0;font-size:20px;">¡Nueva reserva recibida!</h1>
            </div>
            <div style="background:#f9f9f9;padding:24px;border-radius:0 0 12px 12px;">
              <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:8px 0;font-weight:bold;color:#555;width:140px;">Cliente:</td><td style="padding:8px 0;">${datos.nombre}</td></tr>
                <tr><td style="padding:8px 0;font-weight:bold;color:#555;">Email:</td><td style="padding:8px 0;"><a href="mailto:${datos.email}">${datos.email}</a></td></tr>
                <tr><td style="padding:8px 0;font-weight:bold;color:#555;">Paquete:</td><td style="padding:8px 0;"><strong>${datos.paquete}</strong></td></tr>
                <tr><td style="padding:8px 0;font-weight:bold;color:#555;">Fecha viaje:</td><td style="padding:8px 0;">${datos.fechaViaje}</td></tr>
                <tr><td style="padding:8px 0;font-weight:bold;color:#555;">Personas:</td><td style="padding:8px 0;">${datos.numPersonas}</td></tr>
                <tr><td style="padding:8px 0;font-weight:bold;color:#555;">Total:</td><td style="padding:8px 0;color:#0E84C7;font-weight:bold;font-size:18px;">$${Number(datos.total).toLocaleString('es-MX')} MXN</td></tr>
              </table>
              <div style="margin-top:20px;padding-top:20px;border-top:1px solid #e0e0e0;">
                <a href="${this.config.get('NEXT_PUBLIC_URL', 'http://localhost:3001')}/admin/reservas"
                   style="background:#0E84C7;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:bold;">
                  Ver reserva en el admin
                </a>
              </div>
            </div>
          </div>
        `,
      });
      this.logger.log(`Email de reserva enviado: ${datos.nombre}`);
    } catch (err) {
      this.logger.error('Error enviando email de reserva', err);
    }
  }
}
