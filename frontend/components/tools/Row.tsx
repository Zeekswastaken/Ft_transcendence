
type TableDataRow = {
	opponent: string
	score: string
	date: string
	result: string
	avatar: string
	style: string
};

const Row = ( {opponent, score, date, result, avatar, style} : TableDataRow ) => {

	const WinOrLost = result === "win" ? "bg-[#4ADE80]/[0.4]" : "bg-[#FF7171]/[0.4]";
	const WinOrLost_hover = result === "win" ? "hover:bg-[#4ADE80]" : "hover:bg-[#FF7171]";
	
	return (
		<tr className={`${style}  ${WinOrLost} ${WinOrLost_hover}  transition-all duration-700`} >
			<td className="p-3 ">
				<div className="  flex align-items-center ">
					<img className="rounded-full h-12 w-12  object-cover " src={avatar} alt="avatar" />
					<div className=" ml-3 mt-3 font-bold tracking-wider ">{opponent}</div>
				</div>
			</td>
			<td className="px-5 font-Bomb tracking-wide text-2xl">{score}</td>
			<td className="p-3 rounded-r-[.625rem]">{date}</td>
		</tr>
	)
}

export default Row;