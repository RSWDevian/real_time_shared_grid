"use client"

import { ReactNode } from "react"

type ModalProps = {
    title: string;
    onClose: () => void;
    children: ReactNode;
}

export default function Modal({ title, onClose, children }: ModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-sm rounded-lg border border-slate-700  bg-slate-900 p-5 text-slate-100 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        ✕
                    </button>
                </div>
                {children}
            </div>
        </div>
    )
}