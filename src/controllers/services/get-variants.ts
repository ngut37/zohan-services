import joiRouter from 'koa-joi-router';

import { ServiceName, ServiceType } from '@models/service';

const router = joiRouter();

router.route({
  path: '/variants',
  method: 'get',
  handler: [
    async (ctx) => {
      const types: Record<ServiceType, ServiceName[]> = {
        barbershop: [
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
        ],
        hair_salon: [
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
        ],
        manicure: [
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
        ],
        pedicure: [
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
        ],
        massage: [
          'massage_thai_massage',
          'massage_classic_massage',
          'massage_medical_massage',
          'massage_reflexology_massage',
          'massage_special_massage',
          'massage_lymphatic_massage',
          'massage_tantra_massage',
        ],
      };

      ctx.body = {
        success: true,
        data: { ...types },
      };
    },
  ],
});

export default router;
