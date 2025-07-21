import React from 'react';
import Select, { SingleValue } from 'react-select';
import { useGetProjectsQuery } from '../../../services/projectApi';

interface ProjectSelectorProps {
  value: string;
  onSelect: (id: string) => void;
}

interface OptionType {
  value: string;
  label: string;
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({ value, onSelect }) => {
  const { data: projects = [], isLoading } = useGetProjectsQuery();
  

  const options: OptionType[] = projects.map((project: any) => ({
    value: project.id,
    label: project.title,
  }));

  const selectedOption = options.find(opt => opt.value === value) || null;

  return (
    <div>
      <Select
        isLoading={isLoading}
        options={options}
        value={selectedOption}
        onChange={(opt: SingleValue<OptionType>) => onSelect(opt ? opt.value : '')}
        placeholder="Select a project"
        classNamePrefix="react-select"
        isClearable
      />
    </div>
  );
};

export default ProjectSelector; 