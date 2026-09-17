import { useState, useEffect, useRef } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { List, ListNested, BoxArrowRight, Person, ChevronDown } from "react-bootstrap-icons";

export interface HeaderProps {
  collapsed: boolean;
  toggle: () => void;
  onProfileClick: () => void;
  onLogout: () => void;
  username: string;
}

export function Header({ collapsed, toggle, onProfileClick, onLogout, username }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as unknown as { contains(node: unknown): boolean }).contains(event.target)
      ) {
        setIsOpen(false);
      }
    }
    const ownerDocument = (dropdownRef.current as unknown as {
      ownerDocument?: {
        addEventListener: (type: string, listener: (event: MouseEvent) => void) => void;
        removeEventListener: (type: string, listener: (event: MouseEvent) => void) => void;
      };
    } | null)?.ownerDocument;
    ownerDocument?.addEventListener("mousedown", handleClickOutside);
    return () => {
      ownerDocument?.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div style={{ 
      padding: "0 24px", 
      background: "#fff", 
      display: "flex", 
      justifyContent: "space-between", 
      alignItems: "center",
      height: "64px",
      borderBottom: "1px solid #e2e8f0",
      position: "sticky",
      top: 0,
      zIndex: 1040,
      width: "100%"
    }}>
      
      {/* Left side: Sidebar Toggler & Title */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <button
          onClick={toggle}
          style={{ 
            fontSize: "18px", 
            background: "transparent", 
            border: "none", 
            cursor: "pointer",
            padding: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#334155"
          }}
          aria-label="Toggle Sidebar"
        >
          {collapsed ? <List size={22} /> : <ListNested size={22} />}
        </button>
        <div style={{ marginLeft: 16, fontWeight: 600, fontSize: "1.05rem", color: "#0f172a" }}>
          HSMS Dashboard
        </div>
      </div>

      {/* Right side: User Profile Container */}
      <div ref={dropdownRef} style={{ position: "relative" }}>
        {/* Toggle Trigger */}
        <div 
          onClick={() => setIsOpen((prev) => !prev)}
          style={{ 
            cursor: "pointer", 
            display: "flex", 
            alignItems: "center", 
            gap: "10px",
            padding: "6px 12px",
            borderRadius: "20px",
            userSelect: "none",
            backgroundColor: isOpen ? "#f1f5f9" : "transparent",
            transition: "background-color 0.2s"
          }}
        >
          <div style={{ 
            width: 34, 
            height: 34, 
            borderRadius: "50%", 
            background: "#e2e8f0", 
            color: "#475569",
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center" 
          }}>
            <Person size={18} />
          </div>
          <span style={{ fontWeight: 500, color: "#334155" }}>{username}</span>
          <ChevronDown 
            size={12} 
            style={{ 
              color: "#64748b",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s"
            }} 
          />
        </div>

        {/* Floating Menu */}
        {isOpen && (
          <div style={{ 
            position: "absolute",
            right: 0,
            top: "calc(100% + 8px)",
            background: "#ffffff",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)", 
            border: "1px solid #e2e8f0", 
            borderRadius: "10px",
            padding: "6px",
            minWidth: "180px",
            zIndex: 9999
          }}>
            <div 
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                onProfileClick();
              }} 
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "10px", 
                padding: "10px 14px", 
                borderRadius: "6px",
                color: "#334155",
                fontSize: "0.95rem",
                cursor: "pointer"
              }}
              onMouseEnter={(e: ReactMouseEvent<HTMLDivElement>) => ((e.currentTarget as unknown as { style: { backgroundColor: string } }).style.backgroundColor = "#f8fafc")}
              onMouseLeave={(e: ReactMouseEvent<HTMLDivElement>) => ((e.currentTarget as unknown as { style: { backgroundColor: string } }).style.backgroundColor = "transparent")}
            >
              <Person size={16} style={{ color: "#64748b" }} />
              <span>Profile</span>
            </div>
            
            <div style={{ margin: "4px 0", height: "1px", backgroundColor: "#f1f5f9" }} />
            
            <div 
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                onLogout();
              }} 
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "10px", 
                padding: "10px 14px", 
                borderRadius: "6px",
                color: "#dc2626",
                fontSize: "0.95rem",
                cursor: "pointer"
              }}
              onMouseEnter={(e: ReactMouseEvent<HTMLDivElement>) => ((e.currentTarget as unknown as { style: { backgroundColor: string } }).style.backgroundColor = "#fef2f2")}
              onMouseLeave={(e: ReactMouseEvent<HTMLDivElement>) => ((e.currentTarget as unknown as { style: { backgroundColor: string } }).style.backgroundColor = "transparent")}
            >
              <BoxArrowRight size={16} />
              <span>Logout</span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

export default Header;