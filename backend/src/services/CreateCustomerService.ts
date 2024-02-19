import prismaClient from "../prisma"

interface CreateCustomerProps{
  name: string;
  email: string;
  phone: number;
}

class CreateCustomerService{
  async execute({ name, email, phone}: CreateCustomerProps){

   if(!name || !email|| !phone ){
    throw new Error("preencha todos os campos")
   }

   const customer = await prismaClient.customer.create({
    data:{
      name,
      email,
      phone,
    }
   })

    return customer

  }
}

export {CreateCustomerService}
