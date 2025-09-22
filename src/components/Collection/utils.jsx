export const getGradeColor = (grade) => {
    const colorMap = {
        'Entry Grade': 'cyan',
        'High Grade': 'green',
        'Real Grade': 'purple',
        'Master Grade': 'blue',
        'Perfect Grade': 'gold',
        'Super Deformed': 'magenta'
    };
    return colorMap[grade] || 'default';
};