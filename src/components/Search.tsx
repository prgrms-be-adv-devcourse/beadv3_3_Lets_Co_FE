import { useState, type FormEvent } from "react";

interface Props {
    onSearch: (keyword: string) => void;
}

export default function Search({ onSearch }: Props) {

    const [keyword, setKeyword] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSearch(keyword);
    };

    return (
        <search>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="검색어를 입력하세요"
                />
                <button type="submit">검색</button>
            </form>
        </search>
    );
}