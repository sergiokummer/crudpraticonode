import prismaClient from "../prisma";

interface SearchByNameQuery {
  nome: {
    contains: string;
  };
}

class ListCustomersService {
  async execute() {
    const customers = await prismaClient.customer.findMany();
    return customers;
  }

  async searchByName(nome: string) {
    const query: SearchByNameQuery = {
      nome: {
        contains: nome,
      },
    };

    const customers = await prismaClient.customer.findMany({
      where: query as any,
    });

    return customers;
  }
}

export { ListCustomersService };
