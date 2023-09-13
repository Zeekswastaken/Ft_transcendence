import OneVsOne from './component/OneVsOne'

const page = () => {
  return (
    <div className=' text-3xl text-white pt-[150px]  max-w-[1400px]  rounded-[20px]   w-full h-screen '>
        <div className=' glass mx-3 w-auto rounded-[20px] grid place-content-center border-[2px] border-[#FF1382] p-3 min-w-[350px]' >
          <OneVsOne />
        </div>
    </div>
  );
}

export default page