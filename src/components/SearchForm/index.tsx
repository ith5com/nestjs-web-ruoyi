import React, { useState } from "react";

interface SearchFormProps {
	fields: { label: string; name: string; placeholder?: string }[];
	onSearch: (values: Record<string, string>) => void;
	onReset?: () => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ fields, onSearch, onReset }) => {
	const [expand, setExpand] = useState(false);
	const [form, setForm] = useState<Record<string, string>>({});

	// 计算显示的字段
	const showCount = 3 * 2; // 收起时显示2行
	const showFields = expand ? fields : fields.slice(0, showCount);

	const handleChange = (name: string, value: string) => {
		setForm(prev => ({ ...prev, [name]: value }));
	};

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		onSearch(form);
	};

	const handleReset = () => {
		setForm({});
		onReset?.();
	};

	return (
		<form className="mb-4" onSubmit={handleSearch}>
			<div className="flex flex-wrap gap-x-6 gap-y-4">
				{showFields.map(field => (
					<div className="w-1/3 min-w-[220px]" key={field.name}>
						<label className="block text-gray-700 text-sm mb-1">{field.label}</label>
						<input
							className="border rounded px-2 py-1 w-full"
							placeholder={field.placeholder}
							value={form[field.name] || ""}
							onChange={e => handleChange(field.name, e.target.value)}
						/>
					</div>
				))}
			</div>
			<div className="flex items-center gap-2 mt-4">
				<button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded">
					查询
				</button>
				<button type="button" className="border px-4 py-1 rounded" onClick={handleReset}>
					重置
				</button>
				{fields.length > showCount && (
					<button type="button" className="text-blue-500 px-2" onClick={() => setExpand(e => !e)}>
						{expand ? "收起 ∧" : "展开 ∨"}
					</button>
				)}
			</div>
		</form>
	);
};

export default SearchForm;
