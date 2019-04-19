import { isApiExternal } from '@gqlapp/core-common';
import { MiddlewareFunc } from '@gqlapp/module-server-ts';

import GraphQLServerModule from './GraphQLServerModule';
import createResolvers from './resolvers';
import schemaDocument from './schema.graphql';
import graphiqlMiddleware from './graphiql';
import createApolloServer from './createApolloServer';
import { MakeGQLContextCreator } from './types';

const middleware: MiddlewareFunc = (app, appContext, { createGraphQLContext, schema }) => {
  app.get('/graphiql', graphiqlMiddleware);

  if (!isApiExternal) {
    const graphqlServer = createApolloServer({ createGraphQLContext, schema });
    graphqlServer.applyMiddleware({ app, path: __API_URL__, cors: { credentials: true, origin: true } });
  }
};

const makeGQLContextCreator: MakeGQLContextCreator = modules => (req, res) => modules.createContext(req, res);

export * from './api';
export * from './types';
export * from './GraphQLServerModule';
export { default as GraphQLServerModule } from './GraphQLServerModule';

export default new GraphQLServerModule({
  schema: [schemaDocument],
  createResolversFunc: [createResolvers],
  middleware: [middleware],
  appContext: { makeGQLContextCreator }
});
