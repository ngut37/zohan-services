import axios from 'axios';
import joiRouter, { Joi } from 'koa-joi-router';

import { config } from '@config/config';
import { CONFIG_KEYS } from '@config/keys';
import { RawSuggestion } from './types';
import { formatSuggestion } from './utils/suggestion-formatter';

const SUGGESTIONS_COUNT = 6;

const router = joiRouter();

type RequestQuery = {
  phrase: string;
  count?: number;
};

const requestQuerySchema = {
  phrase: Joi.string().required(),
  count: Joi.number().integer(),
};

router.route({
  path: '/suggest',
  method: 'get',
  validate: {
    query: requestQuerySchema,
  },
  handler: async (ctx) => {
    const { phrase, count = SUGGESTIONS_COUNT } = ctx.request
      .query as unknown as RequestQuery;

    try {
      // get suggestion results
      const response = await axios.get(
        `${config.get(CONFIG_KEYS.SMAP_API_URL)}/suggest`,
        { params: { count, phrase } },
      );

      if (response) {
        const formattedSuggestions = (response.data.result as RawSuggestion[])
          .map((rawSuggestion) => formatSuggestion(rawSuggestion))
          .filter(Boolean);

        ctx.body = {
          success: true,
          data: formattedSuggestions,
        };
      } else {
        ctx.body = {
          success: true,
          data: [],
        };
      }
    } catch (error) {
      console.error(error);
      return ctx.throw(500, 'Suggestion service failed to fetch.');
    }
  },
});

export default router;
