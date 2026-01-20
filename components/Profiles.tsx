"use client";

const profiles = [
    { name: "User 1", image: "/images/default-blue.png" },
    { name: "User 2", image: "/images/default-red.png" },
    { name: "Bambini", image: "/kids.png"},
];

interface ProfilesProps {
    onSelect: (name: string) => void;
}

export default function Profiles({ onSelect }: ProfilesProps) {
    return (
        <div className="flex items-center justify-center h-full bg-[#141414]">
            <div className="flex flex-col">
                <h1 className="text-3xl md:text-6xl text-white text-center mb-10 font-medium">
                    Chi vuole guardare Netflix?
                </h1>
                <div className="flex items-center justify-center gap-8 flex-wrap">
                    {profiles.map((profile) => (
                        <div
                            key={profile.name}
                            onClick={() => onSelect(profile.name)}
                            className="group flex-row w-44 mx-auto cursor-pointer"
                        >
                            <div className="w-44 h-44 rounded-md flex items-center justify-center border-2 border-transparent group-hover:cursor-pointer group-hover:border-white overflow-hidden transition duration-200">
                                <img src={profile.image} alt={profile.name} className="object-cover h-full w-full" />
                            </div>
                            <div className="mt-4 text-gray-400 text-2xl text-center group-hover:text-white transition duration-200">
                                {profile.name}
                            </div>
                        </div>
                    ))}
                </div>
                <button className="mt-16 border border-gray-500 text-gray-500 py-2 px-6 uppercase tracking-widest hover:text-white hover:border-white transition mx-auto">
                    Gestisci i profili
                </button>
            </div>
        </div>
    );
}