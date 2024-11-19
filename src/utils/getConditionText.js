export const getConditionText = (conditionPercent) => {
    if (conditionPercent >= 90) return { text: 'Excellent', color: 'text-green-400' }
    if (conditionPercent >= 75) return { text: 'Good', color: 'text-green-300' }
    if (conditionPercent >= 50) return { text: 'Fair', color: 'text-yellow-400' }
    if (conditionPercent >= 25) return { text: 'Poor', color: 'text-orange-400' }
    return { text: 'Critical', color: 'text-red-400' }
}
