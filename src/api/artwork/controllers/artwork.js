'use strict';

// artwork controller 

// imports the createCoreController factory function from Strapi's core libraries
const { createCoreController } = require('@strapi/strapi').factories;

// The createCoreController function takes two arguments: the content type (in this case, api::artwork.artwork)
// and a function that returns an object with the custom controller methods.
module.exports = createCoreController(
    "api::artwork.artwork",
    ({ strapi }) => ({

// This is the custom find method that handles fetching artworks. 
// The ctx (context) object contains information about the current request,
// including any query parameters and the authenticated user (if any).        
    async find(ctx) {
      const { query } = ctx;
      const user = ctx.state.user;
  
// If there is no authenticated user, the method modifies the query to add a filter
// that ensures only fetches artworks with protected set to false.       
      if (!user) {
        // Public user: fetch artworks where protected is false
        query.filters = {
          ...query.filters,
          protected: false,
        };
      }
  
// This line calls the find method on the artwork service to fetch the entities based on the modified query.
// If the user is authenticated, no additional filter is applied, and all artworks are fetched.
      const entities = await strapi.service('api::artwork.artwork').find(query);

// The sanitizeOutput method is a built-in method that helps ensure only safe and necessary data is returned.      
      const sanitizedEntities = await this.sanitizeOutput(entities, ctx);
  
// The sanitized entities are transformed into the appropriate response format and returned to the client.     
      return this.transformResponse(sanitizedEntities);
    },
  }));

// Public users (not authenticated) can only view artworks where protected is false.
// Authenticated users can view all artworks without any additional filters.  