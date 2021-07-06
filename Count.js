    function SetCount(){
    var amounts = document.getElementsByClassName('amounts');
    var amountsIncome = document.getElementsByClassName('amountsIncome');
    var totalExpenses = 0;
    var totalExpensesIncome = 0;
    Array.prototype.forEach.call(amounts,function(e){
        var expenseValue = Number(e.value);
        totalExpenses += expenseValue;
        
    });
    Array.prototype.forEach.call(amountsIncome,function(e){
        var expenseValue = Number(e.value);
        totalExpensesIncome += expenseValue;
        
    });

    var totalCount = document.getElementById('count');
    var totalCountIncome = document.getElementById('countIncome');
    totalCount.innerText = totalExpenses;
    totalCountIncome.innerText = totalExpensesIncome;
    var difference = document.getElementById('countDifference');
    var differenceCount = totalExpensesIncome - totalExpenses;
    console.log(differenceCount);
    if(differenceCount < 0){
        difference.style.color = 'red';
    }
    else{
        difference.style.color = 'green';
    }
    difference.innerText  = differenceCount;
    }
    