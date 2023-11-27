import { CiCirclePlus } from "react-icons/ci";

export const SideBar = () => {
  return (
    <section className='fixed left-0 w-24 bg-quaternary h-full'>
      <div className='flex flex-col h-full'>
        <span className='text-tertiary font-poppins text-lg mx-auto mt-4'>Teams</span>
        <CiCirclePlus className='text-tertiary w-16 h-16 mx-auto fixed left-4 bottom-5 cursor-pointer hover:text-secondary duration-700' />
      </div>
    </section>
  );
};