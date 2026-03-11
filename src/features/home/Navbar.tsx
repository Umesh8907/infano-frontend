"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoClose } from "react-icons/io5";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full sticky top-0 z-50 py-5 bg-gradient-to-r from-primary-100 via-white to-primary-100">
      <div className="max-w-[1200px] mx-auto w-full px-6 flex items-center justify-between">

      {/* Logo */}
      <Link href="/">
        <Image
          src="/homeassets/infano-logo.png"
          alt="Infano Logo"
          width={120}
          height={40}
          priority
        />
      </Link>

      {/* RIGHT SIDE (Desktop Links + Button) */}
      <div className="hidden md:flex items-center gap-10 ml-auto text-[#2B2B2B] font-bold text-[16px] font-[Nunito_Sans]">

        <Link href="#">Solutions</Link>
        <Link href="#">Shop</Link>
        <Link href="#">Community</Link>
        <Link href="#">Blogs</Link>

        {/* CTA Button */}
        <button className="bg-[#4B1F80] hover:bg-[#4a2286] text-white px-6 py-2 rounded-full font-medium transition ml-2">
          Get Started
        </button>

      </div>

      {/* Mobile Hamburger */}
      <div
        className="md:hidden text-[#2B2B2B] cursor-pointer"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <IoClose size={28} /> : <RxHamburgerMenu size={26} />}
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-gradient-to-r from-primary-100 via-white to-primary-100 shadow-md flex flex-col items-center gap-6 py-6 md:hidden font-[Nunito_Sans] font-bold text-[16px]">

          <Link href="#">Solutions</Link>
          <Link href="#">Shop</Link>
          <Link href="#">Community</Link>
          <Link href="#">Blogs</Link>

          <button className="bg-[#4B1F80] text-white px-6 py-2 rounded-full">
            Get Started
          </button>

        </div>
      )}
      </div>
    </nav>
  );
};

export default Navbar;