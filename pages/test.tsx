import React from 'react'

export default function test() {
    
    const url = 'http://127.0.0.1:8000/users/2'
    const callAPI = async () => {
        try {
            const res = await fetch(url);
            const data = await res.json();
            console.log(data);
        } catch (err) {
            console.log(err);
        }
    };

    
    const myOnClick = () =>{
        callAPI()
    }
  
    return (
    <div className=''>
      <button className={'text-xl bg-red-500 text-white p-8'} onClick={myOnClick}>Test</button>
    </div>
  )
}
