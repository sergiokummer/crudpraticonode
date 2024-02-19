import { FastifyRequest, FastifyReply } from "fastify";
import { UpdateCustomerService } from "../services/UpdateCustomerService";

class UpdateCustomerController {
  async handle(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const customerId = request.params.id;
      const { name, email, phone } = request.body as { name: string, email: string, phone: number };

      const updateCustomerService = new UpdateCustomerService();

      const updatedCustomer = await updateCustomerService.execute(customerId, { name, email, phone });

      reply.send(updatedCustomer);
    } catch (error) {
      console.error("Erro ao editar cliente:", error);
      reply.status(500).send({ error: "Erro interno do servidor" });
    }
  }
}

export { UpdateCustomerController };
