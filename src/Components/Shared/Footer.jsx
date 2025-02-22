import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-6 px-4">
      <div className="container mx-auto flex flex-col justify-center items-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold ">Task Manager</h2>
          <p className="text-sm text-gray-400">Organize your tasks efficiently</p>
        </div>

        <div className="mt-3 md:mt-0">
          <p className="text-gray-400 text-sm text-center">
            &copy; {currentYear} Task Manager. All rights reserved by{" "}
            <span className="text-blue-400 font-semibold">Piash</span>.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
