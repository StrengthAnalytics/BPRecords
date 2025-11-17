export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch (error) {
    return dateString;
  }
};

export const formatWeight = (weight: number): string => {
  return `${weight}kg`;
};

export const formatLiftName = (lift: string): string => {
  const liftNames: { [key: string]: string } = {
    'squat': 'Squat',
    'bench_press': 'Bench Press',
    'bench_press_ac': 'Bench Press A/C',
    'deadlift': 'Deadlift',
    'total': 'Total'
  };
  return liftNames[lift] || lift;
};

export const formatEquipment = (equipment: string): string => {
  return equipment.charAt(0).toUpperCase() + equipment.slice(1);
};

export const formatGender = (gender: 'M' | 'F'): string => {
  return gender === 'M' ? 'Male' : 'Female';
};
