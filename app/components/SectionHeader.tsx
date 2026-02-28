import React from "react";

export const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <h2 className="font-semibold text-black text-lg text-center tracking-[0] leading-[normal]">
            {children}
        </h2>
    )
}

export default SectionHeader;