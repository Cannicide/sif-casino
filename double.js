function dble(args, ifprofile, prefix) {
    if (args) {
        var amount = args[0];
      }
      else {
       return "Please specify a bet.";
      }
      if (amount && amount > 0 && ifprofile && amount <= Number(ifprofile)) {
          //Double code:
        return "Successful double."
      }
      else if (!ifprofile) {
          return `Create a profile first with ${prefix}create`;
      }
      else {
         return `Please specify a valid bet that is less than or equal to your current balance. Check with ${prefix}balance.`; 
      }
}

module.exports = {
    dble: dble
}