import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from "fastify";
import { CreateCustomerController } from "./controllers/CreateCustomerController";
import { ListCustomersController } from "./controllers/ListCustomersController";
import { DeleteCustomerController } from "./controllers/DeleteCustomerController";
import { UpdateCustomerController } from "./controllers/UpdateCustomerController";


export async function routes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  interface QueryParameters {
    name?: string;

  }

  interface RouteParams {
    Querystring: QueryParameters;
  }

  fastify.post("/customer", async (request: FastifyRequest, reply: FastifyReply) => {
    return new CreateCustomerController().handle(request, reply)
  })
  fastify.get("/customers", async (request: FastifyRequest<RouteParams>, reply: FastifyReply) => {
    return new ListCustomersController().handle(request, reply);
  });
  fastify.put<{ Params: { id: string } }>("/customers/:id", async (request, reply) => {
    return new UpdateCustomerController().handle(request, reply);
  });
  fastify.delete("/customer", async (request: FastifyRequest, reply: FastifyReply) => {
    return new DeleteCustomerController().handle(request, reply)
  })


}
