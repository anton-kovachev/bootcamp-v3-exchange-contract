"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "@/app/assets/logo.png";
import collapse from "@/app/assets/carets/collapse.svg";
import expand from "@/app/assets/carets/expand.svg";
import wallet from "@/app/assets/links/wallet.svg";
import trading from "@/app/assets/links/trading.svg";
import swap from "@/app/assets/links/swap.svg";
import loans from "@/app/assets/links/loans.svg";

function SideNav() {
  const path = usePathname();
  const links = [
    { label: "Wallet", icon: wallet, href: "/wallet" },
    { label: "Trading", icon: trading, href: "/" },
    { label: "Swap", icon: swap, href: "/swap" },
    { label: "Loans", icon: loans, href: "/loans" },
  ];
  return (
    <nav className="sidenav">
      <div className="logo">
        <Image src={logo} alt="logo" />
        <p>DAAP Exchange</p>
      </div>

      <button className="toggle">
        <Image src={collapse} alt="Collapse" />
      </button>

      <ul className="links">
        {links.map((x) => (
          <li key={x.href}>
            <Link
              href={x.href}
              className={`link ${x.href === path ? "link--active" : ""}`}
            >
              <div className="label">
                <div className="icon">
                  <Image src={x.icon} alt={links.label} />
                </div>
                <span>{x.label}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default SideNav;
