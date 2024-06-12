import { enumerate } from '@utils/enumerate';

export const SERVICE_TYPES = enumerate([
  'barbershop',
  'hair_salon',
  'manicure',
  'pedicure',
  'massage',
]);

export type ServiceType = keyof typeof SERVICE_TYPES;

export const SERVICE_NAMES = enumerate([
  // BARBERSHOP
  'barbershop_classic_haircut',
  'barbershop_classic_haircut_long_hair',
  'barbershop_clipper_cut',
  'barbershop_hair_styling',
  'barbershop_hair_coloring',
  'barbershop_traditional_shaving',
  'barbershop_beard_care',
  'barbershop_beard_styling',
  'barbershop_beard_coloring',
  'barbershop_nose_hair_removal',

  // HAIR SALON
  'hair_salon_men_haircut',
  'hair_salon_men_electric_razor_cut',
  'hair_salon_men_hair_coloring',
  'hair_salon_women_haircut',
  'hair_salon_children_haircut',
  'hair_salon_hair_root_coloring',
  'hair_salon_foil_highlights',
  'hair_salon_balayage',
  'hair_salon_airtouch',
  'hair_salon_brazilian_keratin',
  'hair_salon_formal_wedding_hairstyle',
  'hair_salon_blow_dry',
  'hair_salon_flat_ironing',
  'hair_salon_complete_hair_bleaching_with_toning',
  'hair_salon_hair_root_bleaching_with_toning',

  // MANICURE
  'manicure_clear',
  'manicure_acrylic_nails_with_glitter',
  'manicure_acrylic_nails_new_with_color',
  'manicure_acrylic_nails_refill_colorless',
  'manicure_acrylic_nails_with_color',
  'manicure_acrylic_nails_french',
  'manicure_gel_nails_new_colorless',
  'manicure_gel_nails_refill_colorless',
  'manicure_gel_nails_with_color',
  'manicure_gel_nails_with_glitter',
  'manicure_gel_nails_french',
  'manicure_p_shine_clear',

  // PEDICURE
  'pedicure_wet',
  'pedicure_dry_machine_medical',
  'pedicure_combined',
  'pedicure_luxury_spa',
  'pedicure_nail_treatment',
  'pedicure_peeling',
  'pedicure_mask',
  'pedicure_foot_massage',
  'pedicure_nail_polish',
  'pedicure_french_nail_polish',
  'pedicure_acrylic_nails',
  'pedicure_gel_nails',
  'pedicure_ingrown_nail_treatment',
  'pedicure_callus_removal',

  // MASSAGE
  'massage_thai_massage',
  'massage_classic_massage',
  'massage_medical_massage',
  'massage_reflexology_massage',
  'massage_special_massage',
  'massage_lymphatic_massage',
  'massage_tantra_massage',
]);

export type ServiceName = keyof typeof SERVICE_NAMES;

const SERVICE_NAME_TO_CZECH_NAME_MAP: Record<ServiceName, string> = {
  barbershop_classic_haircut: 'Klasické stříhání',
  barbershop_classic_haircut_long_hair: 'Klasické stříhání - dlouhé vlasy',
  barbershop_clipper_cut: 'Střih strojkem',
  barbershop_hair_styling: 'Styling vlasů',
  barbershop_hair_coloring: 'Barvení vlasů',
  barbershop_traditional_shaving: 'Tradiční holení',
  barbershop_beard_care: 'Péče o vousy',
  barbershop_beard_styling: 'Styling vousů',
  barbershop_beard_coloring: 'Barvení vousů',
  barbershop_nose_hair_removal: 'Odstranění chloupků v nose',

  hair_salon_men_haircut: 'Pánské stříhání',
  hair_salon_men_electric_razor_cut: 'Pánské stříhání pouze se strojkem',
  hair_salon_men_hair_coloring: 'Panské barvení vlasů',
  hair_salon_women_haircut: 'Dámské stříhání',
  hair_salon_children_haircut: 'Dětské stříhání',
  hair_salon_hair_root_coloring: 'Barvení odrostů',
  hair_salon_foil_highlights: 'Melír (fólie)',
  hair_salon_balayage: 'Balayage',
  hair_salon_airtouch: 'Airtouch',
  hair_salon_brazilian_keratin: 'Brazilský keratin',
  hair_salon_formal_wedding_hairstyle: 'Slavnostní / svatební účes',
  hair_salon_blow_dry: 'Foukaná',
  hair_salon_flat_ironing: 'Žehlení',
  hair_salon_complete_hair_bleaching_with_toning:
    'Kompletní odbarvení celých vlasů s tónovaním',
  hair_salon_hair_root_bleaching_with_toning: 'Odbarvení odrostů s tónováním',

  manicure_clear: 'Manikúra čistá',
  manicure_acrylic_nails_with_glitter: 'Akrylové nehty - s třpytkami',
  manicure_acrylic_nails_new_with_color: 'Akrylové nehty - nové - s barvou',
  manicure_acrylic_nails_refill_colorless:
    'Akrylové nehty - doplnění - bez barvy',
  manicure_acrylic_nails_with_color: 'Akrylové nehty - s barvou',
  manicure_acrylic_nails_french: 'Akrylové nehty - francouzské',
  manicure_gel_nails_new_colorless: 'Gelové nehty - nové - bez barvy',
  manicure_gel_nails_refill_colorless: 'Gelové nehty - doplnění - bez barvy',
  manicure_gel_nails_with_color: 'Gelové nehty - s barvou',
  manicure_gel_nails_with_glitter: 'Gelové nehty - s třpytkami',
  manicure_gel_nails_french: 'Gelové nehty - francouzské',
  manicure_p_shine_clear: 'P-shine čistá',

  pedicure_wet: 'Pedikúra mokrá',
  pedicure_dry_machine_medical: 'Pedikúra přístrojová (suchá, medicinální)',
  pedicure_combined: 'Pedikúra kombinovaná',
  pedicure_luxury_spa: 'Spa pedikúra luxusní',
  pedicure_nail_treatment: 'Úprava nehtů',
  pedicure_peeling: 'Peeling',
  pedicure_mask: 'Maska',
  pedicure_foot_massage: 'Masáž nohou',
  pedicure_nail_polish: 'Lakování',
  pedicure_french_nail_polish: 'Lakování - francouzské',
  pedicure_acrylic_nails: 'Akrylové nehty',
  pedicure_gel_nails: 'Gelové nehty',
  pedicure_ingrown_nail_treatment: 'Ošetření zarostlého nehtu',
  pedicure_callus_removal: 'Odstranění kuřích ok',

  massage_thai_massage: 'Thajská masáž',
  massage_classic_massage: 'Klasická masáž',
  massage_medical_massage: 'Zdravotní masáž',
  massage_reflexology_massage: 'Reflexní masáž',
  massage_special_massage: 'Speciální masáž',
  massage_lymphatic_massage: 'Lymfatická masáž',
  massage_tantra_massage: 'Tantra masáž',
};

export function mapEnumToFormattedCzechName(serviceEnum: ServiceName): string {
  const czechName = SERVICE_NAME_TO_CZECH_NAME_MAP[serviceEnum];

  if (!czechName) {
    throw new Error(`Service type "${serviceEnum}" not found in the map.`);
  }

  return czechName;
}
