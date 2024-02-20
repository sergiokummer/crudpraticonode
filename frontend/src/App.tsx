import { FiTrash, FiEdit } from "react-icons/fi"
import { api } from "./services/api"
import { useEffect, useState, useRef, FormEvent } from "react"
import Modal from 'react-modal';
import { isSameDay, isSameWeek, isSameMonth } from 'date-fns';

const customStyles = {

  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: ""
  },
  content: {
    position: 'absolute',
    top: -159,
    left: 0,
    right: 0,
    bottom: 0,
    margin: 'auto',
    width: '29%',
    height: '70%',
    backgroundColor: "black",
    padding: "200px 40px 0px 40px"
  },
};

Modal.setAppElement("#root")

interface CustomerProps{
  id: string;
  name:string;
  email: string;
  phone: number;
  created_at: string;
}

export default function App() {
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [updatedData, setUpdatedData] = useState<{ name?: string; email?: string; phone?: number }>({});
  const [customers, setCustomers] = useState<CustomerProps[]>([]);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const phoneRef = useRef<HTMLInputElement | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalIsOpen, setIsOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterPeriod, setFilterPeriod] = useState<'custom' | 'all'>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');



  function handleSearchTerm(e){
    const query = e.target.value;
    setSearchTerm(query);
    fetchCustomers(query);
    console.log(customers)
  }

  function handlePeriodFilter(e){
    setEndDate(e.target.value);
    setFilterPeriod("custom");
  }

  function handleOpenModal(){
    setIsOpen(true);
  }
  function handleCloseModal(){
    setIsOpen(false);
  }

  const fetchCustomers = async (query) => {
    const endpoint =  query ? `/customers?name=${query}` : '/customers';
    const response = await api.get(endpoint);
    setCustomers(response.data);
  };
  useEffect(() => {
    fetchCustomers(null);
  }, []);

  function handleOpenEditModal(id: string) {

    setEditModalIsOpen(true);
    setSelectedCustomerId(id);
  }

  async function loadCustomers() {
    const response = await api.get(`/customers`);
    setCustomers(response.data);
  }

 async function handleSubmit(event: FormEvent){
    event.preventDefault();

    if(!nameRef.current?.value || !emailRef.current?.value || !phoneRef.current?.value) return;

    const request = {
      name: nameRef.current?.value,
      email: emailRef.current?.value,
      phone: Number(phoneRef.current?.value)
    }

    const response = await api.post("/customer", request)

    setCustomers(allCustomers => [...allCustomers, response.data])

    nameRef.current.value = ""
    emailRef.current.value = ""
    phoneRef.current.value = ""
  }

  async function handleDelete(id: string){

    await api.delete("/customer",{
      params: {
        id: id,
      }
    })
    const allCustomers = customers.filter( (customer)=> customer.id !== id)
    setCustomers(allCustomers)
  }

  async function handleUpdate(id: string) {
    try {
      await api.put(`/customers/${id}`, updatedData);


      const updatedCustomers = customers.map((customer) =>
        customer.id === id ? { ...customer, ...updatedData } : customer
      );
      setCustomers(updatedCustomers);


      setUpdatedData({});
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
    }
  }


const filteredCustomers = customers
  // .filter((customer) =>
  //   customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  // )
  .filter((customer) => {
    const createdAt = new Date(customer.created_at);

    console.log(filterPeriod)

    if (filterPeriod !== 'all' && startDate !== undefined && endDate !== undefined) {
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate + 'T23:59:59');

      return createdAt >= startDateObj && createdAt <= endDateObj;
    }

    return true;
  })
  .sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();

    if (sortOrder === 'asc') {
      return dateA - dateB;
    } else {
      return dateB - dateA;
    }
  });

  return(
    <div className="w-full min-h-screen bg-black flex justify-center px-4">
      <main className="my-10 w-full md:max-w-2xl">

        <h1 className="text-4xl font-medium text-white flex justify-center">Usuários</h1>
      <button className="cursor-pointer w-full p-2 bg-green-400 rounded font-medium mt-9 mb-9 hover:bg-green-700" onClick={handleOpenModal}>Cadastrar</button>
<input
  type="date"
  value={startDate}
  onChange={(e) => setStartDate(e.target.value)}
  className="w-1/2 mb-2 p-2"
/>
<input
  type="date"
  value={endDate}
  onChange={(e) => handlePeriodFilter(e)}
  className="w-1/2 mb-2 p-2"
/>



<select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')} className="w-full mb-2 p-2">
  <option value="asc">Do Menor para o Maior</option>
  <option value="desc">Do Maior para o Menor</option>
</select>



      <Modal isOpen={modalIsOpen}
      onRequestClose={handleCloseModal}
      style={customStyles}
      >



      <form className="flex flex-col my-6" onSubmit={handleSubmit}>
        <label className="font-large text-white">Nome: </label>
        <input
          type="text"
          placeholder="Digite seu nome"
          className="w-full mb-5 p-2"
          ref={nameRef} />

        <label className="font-medium text-white">Email: </label>
        <input
          type="text"
          placeholder="Digite seu email"
          className="w-full mb-5 p-2"
          ref={emailRef} />

        <label className="font-medium text-white">Phone: </label>
        <input
          type="number"
          placeholder="996166601"
          className="w-full mb-5 p-2"
          ref={phoneRef}/>


        <input
          type="submit"
          value="Cadastrar"
          className="cursor-pointer w-full p-2 mb-5 bg-green-400 rounded font-medium  hover:bg-green-700 mt-4" />
      </form>
      </Modal>

      <Modal isOpen={editModalIsOpen} onRequestClose={() => setEditModalIsOpen(false)}style={customStyles}>
          <h1 className='text-4xl font-medium text-white flex justify-center'>Edite seu Usuário</h1>
        <form className="flex flex-col my-6" onSubmit={() => handleUpdate(selectedCustomerId)}>
          <label className="font-medium text-white">Nome:</label>
          <input

            type="text"
            placeholder="Digite seu nome"
            className="w-full mb-5 p-2"
            ref={nameRef}
            value={updatedData.name || ''}
            onChange={(e) => setUpdatedData({ ...updatedData, name: e.target.value })}
          />

          <label className="font-medium text-white">Email:</label>
          <input
            type="text"
            placeholder="Digite seu email"
            className="w-full mb-5 p-2"
            ref={emailRef}
            value={updatedData.email || ''}
            onChange={(e) => setUpdatedData({ ...updatedData, email: e.target.value })}
          />

          <label className="font-medium text-white">Phone:</label>
          <input
            type="number"
            placeholder="996166601"
            className="w-full mb-5 p-2"
            ref={phoneRef}
            value={updatedData.phone || ''}
            onChange={(e) => setUpdatedData({ ...updatedData, phone: Number(e.target.value) })}
          />

          <input
            type="submit"
            value="Atualizar"
            className="cursor-pointer w-full p-2 mb-5 bg-green-400 rounded font-medium"
          />
        </form>
      </Modal>


      <section className="flex flex-col  gap-4">
      <input
        type="text"
        placeholder="Pesquisar por nome"
        value={searchTerm}
        onChange={(e) => handleSearchTerm(e)        }
        className="w-full mb-5 p-2"
/>
     {filteredCustomers.map( (customer)=>(

         <article className="w-full bg-white p-2 relative hover:bg-slate-500" key={customer.id}>
         <p><span>Nome: </span>{customer.name}</p>
         <p><span>Email: </span>{customer.email}</p>
         <p><span>Phone: </span>{customer.phone}</p>
         <button className="bg-red-600 w-7 h-7 flex items-center justify-center rounded-lg absolute right-0 top-4 mr-3" onClick={()=> handleDelete(customer.id)}> <FiTrash size={18} color="#FFF"/></button>
         <button
              className="bg-blue-500 w-7 h-7 flex items-center justify-center rounded-lg absolute right-0 top-12 mr-3"
              onClick={() => handleOpenEditModal(customer.id)}
            >
              <FiEdit size={18} color="#FFF" />
            </button>
       </article>
     ))}

      </section>

      </main>

    </div>
  )

}
