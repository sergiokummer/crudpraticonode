import prismaClient from "../prisma";

interface UpdateCustomerProps {
  name?: string;
  email?: string;
  phone?: number;
}

class UpdateCustomerService {
  async execute(customerId: string, updatedData: UpdateCustomerProps) {
    try {
      const existingCustomer = await prismaClient.customer.findUnique({
        where: {
          id: customerId,
        },
      });

      if (!existingCustomer) {
        throw new Error('Cliente não encontrado');
      }

      const updatedCustomer = await prismaClient.customer.update({
        where: {
          id: customerId,
        },
        data: updatedData,
      });

      return updatedCustomer;
    } catch (error) {
      console.error('Erro ao atualizar cliente com Prisma:', error);
      throw new Error('Erro ao atualizar cliente');
    }
  }
}

export { UpdateCustomerService };
