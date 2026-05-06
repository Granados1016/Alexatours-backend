export class CreateArticuloDto {
  titulo: string;
  slug?: string;
  contenido: string;
  resumen?: string;
  imagen_portada?: string;
  categoria?: string;
  meta_descripcion?: string;
  tags?: string[];
  publicado?: boolean;
}
