import React from 'react';

const Navbar = () => {
    return (
        <div className="w-[96%] bg-blue-400 p-4 rounded-[30px] flex flex-wrap justify-center gap-4 lg:justify-between items-center">
            <span className="text-[30px] lg:text-[60px] font-bold flex gap-2 items-center">
                GithubID
            </span>
            <div className="p-2 border-2 border-blue-900 text-blue-900 rounded-xl text-[16px] lg:text-[24px] font-bold">
                <a href="https://lokendarjangidweb.vercel.app">Lokendar Jangid</a>
            </div>
        </div>
    );
};

export default Navbar;