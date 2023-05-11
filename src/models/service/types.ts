import { enumerate } from '@utils/enumerate';

export const SERVICE_TYPES = enumerate([
  'barbershop',
  'hair-salon',
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
  'hair-salon_men_haircut',
  'hair-salon_men_electric_razor_cut',
  'hair-salon_men_hair_coloring',
  'hair-salon_women_haircut',
  'hair-salon_children_haircut',
  'hair-salon_hair_root_coloring',
  'hair-salon_foil_highlights',
  'hair-salon_balayage',
  'hair-salon_airtouch',
  'hair-salon_brazilian_keratin',
  'hair-salon_formal_wedding_hairstyle',
  'hair-salon_blow-dry',
  'hair-salon_flat_ironing',
  'hair-salon_complete_hair_bleaching_with_toning',
  'hair-salon_hair_root_bleaching_with_toning',

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
  'manicure_p-shine_clear',

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
  'massage_thai',
  'massage_classic',
  'massage_medical',
  'massage_reflexology',
  'massage_special',
  'massage_lymphatic',
  'massage_tantra',
]);

export type ServiceName = keyof typeof SERVICE_NAMES;
