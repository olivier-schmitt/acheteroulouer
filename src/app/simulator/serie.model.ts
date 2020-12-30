
export class Serie {
    
    name:String;

    data:Array<number>;
    
    stack:String;

    sum: number;

    constructor(aName,aData,aStack){
        this.name = aName;
        this.data = aData;
        this.stack = aStack;
        this.sum = this.computeSum();
    }

    computeSum():number {
        let i = 0;
        let total = 0;
        for(;i < this.data.length;i++){
            total = total + this.data[i];
        }
        return total;
    }
}