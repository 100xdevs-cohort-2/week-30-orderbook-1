
export const AskTable = ({ asks }: { asks: [string, string][] }) => {
    let currentTotal = 0;
    asks.reverse();
    const asksWithTotal: [string, string, number][] = asks.map(([price, quantity]) => [price, quantity, currentTotal += Number(quantity)]);
    const maxTotal = asks.reduce((acc, [_, quantity]) => acc + Number(quantity), 0);
    asksWithTotal.reverse();

    return <div className="mt-5">
        {asksWithTotal.map(([price, quantity, total]) => <Ask maxTotal={maxTotal} key={price} price={price} quantity={quantity} total={total} />)}
    </div>
}
function Ask({price, quantity, total, maxTotal}: {price: string, quantity: string, total: number, maxTotal: number}) {
    return <div
    style={{
        display: "flex",
        position: "relative",
        marginTop:4,
        width: "100%",
        backgroundColor: "transparent",
    }}
>
    <div
        style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: `${(100 * (total)) / maxTotal}%`, 
        height: "100%",
        background: "rgba(228, 75, 68, 0.325)",
        transition: "width 0.3s ease-in-out",
        }}
    ></div>
    <div className="flex justify-between text-xs w-full">
        <div>
            {price}
        </div>
        <div>
            {quantity}
        </div>
        <div>
            {total?.toFixed(2)}
        </div>
    </div>
    </div>
}