export const getFormattedInputValue = value => {
   if(value.length === 4 || value.length < 4) return '+998'
   const digits = value.replace(/\D/g, "").slice(3, 17)
   const code = value.replace(/\D/g, "").slice(0, 3)
   let res = ''
   if(digits.length >= 0) {
     res = `${digits.slice(0, 2)}`
   }
   if(digits.length >= 3) {
     res += `-${digits.slice(2, 5)}`
   }
   if(digits.length >=6) {
     res += `-${digits.slice(5, 7)}`
   }
   if(digits.length >=8) {
     res += `-${digits.slice(7, 9)}`
   }
 
   return `+${code}-${res}`
 }