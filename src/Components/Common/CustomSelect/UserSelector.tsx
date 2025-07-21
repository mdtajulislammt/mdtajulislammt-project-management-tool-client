import React from 'react';
import Select, { SingleValue } from 'react-select';
import { useGetUsersQuery } from '../../../services/userApi';

// Make sure to install react-select: npm install react-select

interface UserSelectorProps {
  value: string;
  onSelect: (id: string) => void;
}

interface OptionType {
  value: string;
  label: string;
}

const UserSelector: React.FC<UserSelectorProps> = ({ value, onSelect }) => {
  const { data: users = [], isLoading } = useGetUsersQuery();
  console.log("users",users)

  const options: OptionType[] = users.map((user: any) => ({
    value: user.id,
    label: user.name,
  }));

  const selectedOption = options.find(opt => opt.value === value) || null;

  return (
    <div>
      {/* <label className="block text-sm font-medium text-gray-700 mb-2">Assign To *</label> */}
      <Select
        isLoading={isLoading}
        options={options}
        value={selectedOption}
        onChange={(opt: SingleValue<OptionType>) => onSelect(opt ? opt.value : '')}
        placeholder="Select a person"
        classNamePrefix="react-select"
        isClearable
      />
    </div>
  );
};

export default UserSelector; 