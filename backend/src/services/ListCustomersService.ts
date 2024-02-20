import prismaClient from "../prisma";

interface SearchByNameQuery {
  name: {
    contains: string;

  };
}

class ListCustomersService {
  async execute() {
    const customers = await prismaClient.customer.findMany();
    return customers;
  }

  async searchByName(name: string) {
    const query: SearchByNameQuery = {
      name: {
        contains: name,
        mode: "insensitive"
      },
    };

    const customers = await prismaClient.customer.findMany({
      where: query as any,
    });

    return customers;
  }
}

export { ListCustomersService };
