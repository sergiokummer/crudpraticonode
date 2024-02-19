import { FastifyRequest, FastifyReply } from "fastify";
import { ListCustomersService } from "../services/ListCustomersService";

interface QueryParameters {
  nome?: string;
}

class ListCustomersController {
  async handle(request: FastifyRequest<{ Querystring: QueryParameters }>, reply: FastifyReply) {
    try {
      const { nome } = request.query;

      const listCustomerService = new ListCustomersService();
      let customers;

      if (nome) {
        customers = await listCustomerService.searchByName(nome);
      } else {
        customers = await listCustomerService.execute();
      }

      reply.send(customers);
    } catch (error) {
      console.error("Erro ao listar clientes:", error);
      reply.status(500).send({ error: "Erro ao listar clientes" });
    }
  }
}

export { ListCustomersController };
