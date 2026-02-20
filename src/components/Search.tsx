import { useState, type FormEvent } from "react";

interface Props {
    onSearch: (keyword: string) => void;
}

function Search({ onSearch }: Props) {
    const [keyword, setKeyword] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSearch(keyword);
    };

    return (
        <form className="flex w-full h-14" onSubmit={handleSubmit}>
            <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="검색어를 입력하세요"
                className="flex-grow p-4 text-lg border border-gray-300 rounded-l-md"
            />

            <button
                type="submit"
                className="bg-white border border-l-0 border-gray-300 px-6 rounded-r-md hover:bg-gray-100 flex items-center justify-center"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-12 text-gray-700" 
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                    />
                </svg>
            </button>
        </form>
    );
}

export default Search;