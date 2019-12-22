//打印棋盘
const print_board = (dim : number,board: Array<Array<string>>) => {
    var str_for_print : string = "" 
    str_for_print += "\t"
    for (let i = 0; i < dim; i++) {
        str_for_print += String.fromCharCode("a".charCodeAt(0)+i);
        str_for_print += "\t";
    }
    console.log(str_for_print)
    for (let i = 0; i < dim; i++) {
        str_for_print = "";
        str_for_print += String.fromCharCode("a".charCodeAt(0)+i);
        str_for_print += "\t";
        str_for_print += board[i].join("\t")
        console.log(str_for_print);
    }
}
//生成格式化时间
const formatDate = () => {
    //三目运算符
    const Dates = new Date();
    //年份
    const Year : number = Dates.getFullYear(); 
    //月份下标是0-11
    const Months : any = ( Dates.getMonth() + 1 ) < 10  ?  '0' + (Dates.getMonth() + 1) : ( Dates.getMonth() + 1); 
    //具体的天数
    const Day : any = Dates.getDate() < 10 ? '0' + Dates.getDate() : Dates.getDate();
    //小时
    const Hours = Dates.getHours() < 10 ? '0' + Dates.getHours() : Dates.getHours();
    //分钟
    const Minutes = Dates.getMinutes() < 10 ? '0' + Dates.getMinutes() : Dates.getMinutes();
    //秒
    const Seconds = Dates.getSeconds() < 10 ? '0' + Dates.getSeconds() : Dates.getSeconds();
    //返回数据格式
    return Year + '-' + Months + '-' + Day + ' ' + Hours + ':' + Minutes + ':' + Seconds; 
}
//将对弈日志写入文件
const writeLog = (date:string, used_time:number, dimension:number, pc_plays:string, pc_score:number, human_score:number, giveup : boolean) => {
    var str_list : string[] = [];
    str_list.push(date);
    str_list.push((used_time/1000).toString());
    str_list.push(dimension + "*" + dimension);
    if (pc_plays == "X") {
        str_list.push("computer")
        str_list.push("human")
    } else {
        str_list.push("human")
        str_list.push("computer")
    }
    if (giveup) {
        str_list.push("Human gave up.")
    } else {
        if (pc_plays == "X") {
            str_list.push(pc_score + " to " + human_score);
        } else {
            str_list.push(human_score + " to " + pc_score);
        }
    }
    fs.writeFileSync('Reversi.csv', str_list.join(",")+'\n',{flag:'a'});
}

//得分矩阵初始化
const board_score_init = (dim:number) => {
    var board_score : Array<Array<number>> = new Array<Array<number>>();
    for(let i = 0; i < dim; ++i) {
        board_score.push([])
        for(let j = 0; j < dim; ++j) {
            board_score[i][j] = 0;
        }
    }
    return board_score;
}
//初始化棋盘
const board_init = (dim:number) => {
    const init_position = dim / 2 - 1;
    var board : Array<Array<string>> = new Array<Array<string>>()
    for(let i = 0; i < dim ; ++i) {
        board.push([])
        for(let j = 0; j < dim; ++j) {
            board[i][j] = "."
        }
    }
    board[init_position][init_position] = "O";
    board[init_position][init_position + 1] = "X";
    board[init_position + 1][init_position] = "X";
    board[init_position + 1][init_position + 1] = "O";
    return board;
}
//计算落子点的得分以及执行翻转操作
const cal_score = (board : Array<Array<string>>, row : number, column : number, nowplay : string, reverse : boolean) => {
    //以(row, column)为中心点向八个方向搜索
    var dimension : number = board.length;
    var score : number = 0;
    var temp_score : number = 0;
    var nextplay : string = (nowplay == "X") ? "O" : "X";
    //上
    temp_score = 0;
    for (let i = row - 1; i >= 0; i--) {
        temp_score = 0;
        if (board[i][column] == nextplay) {
            continue;
        } else if (board[i][column] == nowplay){
            temp_score = Math.abs(row - i) - 1;//计算夹在中间的敌方棋子
            score += temp_score;
            break;
        } else if (board[i][column] == ".") break;
    }
    if (reverse){ //如果翻转变量为真，那就在计算得分的时候顺便把棋子翻转操作做掉
        for (let i = 1; i <= temp_score; i++){
            board[row - i][column] = nowplay;
        }
    }
    //下
    temp_score = 0;
    for (let i = row + 1; i < dimension; i++) {
        temp_score = 0;
        if (board[i][column] == nextplay) {
            continue;
        } else if (board[i][column] == nowplay){
            temp_score = Math.abs(row - i) - 1;//计算夹在中间的敌方棋子
            score += temp_score;
            break;
        } else if (board[i][column] == ".") break;
    }
    if (reverse){ 
        for (let i = 1; i <= temp_score; i++){
            board[row + i][column] = nowplay;
        }
    }
    //左
    temp_score = 0;
    for (let i = column - 1; i >= 0; i--) {
        temp_score = 0;
        if (board[row][i] == nextplay) {
            continue;
        } else if (board[row][i] == nowplay){
            temp_score = Math.abs(column - i) - 1;//计算夹在中间的敌方棋子
            score += temp_score;
            break;
        } else if (board[row][i] == ".") break;
    }
    if (reverse){ 
        for (let i = 1; i <= temp_score; i++){
            board[row][column - i] = nowplay;
        }
    }
    //右
    temp_score = 0;
    for (let i = column + 1; i < dimension; i++) {
        temp_score = 0;
        if (board[row][i] == nextplay) {
            continue;
        } else if (board[row][i] == nowplay){
            temp_score = Math.abs(column - i) - 1;//计算夹在中间的敌方棋子
            score += temp_score;
            break;
        } else if (board[row][i] == ".") break;
    }
    if (reverse){ 
        for (let i = 1; i <= temp_score; i++){
            board[row][column + i] = nowplay;
        }
    }
    //左上
    temp_score = 0;
    for (let i = row - 1, j = column - 1; i >= 0 && j >= 0; --i, --j) {
        temp_score = 0;
        if (board[i][j] == nextplay) continue;
        else if (board[i][j] == nowplay){
            temp_score = Math.abs(i - row) - 1;
            score += temp_score;
            break;
        } else if (board[i][j] == ".") break;
    }
    if (reverse) {
        for (let i = 1; i <= temp_score; ++i) {
            board[row - i][column - i] = nowplay;
        }
    }
    //右上
    temp_score = 0;
    for (let i = row - 1, j = column + 1; i >= 0 && j < dimension; --i, ++j) {
        temp_score = 0;
        if (board[i][j] == nextplay) continue;
        else if (board[i][j] == nowplay){
            temp_score = Math.abs(i - row) - 1;
            score += temp_score;
            break;
        } else if (board[i][j] == ".") break;
    }
    if (reverse) {
        for (let i = 1; i <= temp_score; ++i) {
            board[row - i][column + i] = nowplay;
        }
    }
    //左下
    temp_score = 0;
    for (let i = row + 1, j = column - 1; i < dimension && j >= 0; ++i, --j) {
        temp_score = 0;
        if (board[i][j] == nextplay) continue;
        else if (board[i][j] == nowplay){
            temp_score = Math.abs(i - row) - 1;
            score += temp_score;
            break;
        } else if (board[i][j] == ".") break;
    }
    if (reverse) {
        for (let i = 1; i <= temp_score; ++i) {
            board[row + i][column - i] = nowplay;
        }
    }
    //右下
    temp_score = 0;
    for (let i = row + 1, j = column + 1; i < dimension && j < dimension; ++i, ++j) {
        temp_score = 0;
        if (board[i][j] == nextplay) continue;
        else if (board[i][j] == nowplay){
            temp_score = Math.abs(i - row) - 1;
            score += temp_score;
            break;
        } else if (board[i][j] == ".") break;
    }
    if (reverse) {
        for (let i = 1; i <= temp_score; ++i) {
            board[row + i][column + i] = nowplay;
        }
    }
    return score;
}
//计算当前棋盘每个点的可能得分
const getBoardScore = (board : Array<Array<string>>, nowplay : string) => { //nowplay用于表示现在轮到谁下
    var board_score : Array<Array<number>> = board_score_init(dimension);
    for (let i = 0; i < dimension; ++i) {
        for (let j = 0; j < dimension; ++j) {
            if (board[i][j] != ".") {
                board_score[i][j] = 0;
            } else {
                board_score[i][j] = cal_score(board, i, j, nowplay, false);
            }
        }
    }
    return board_score;
}
//判断落子点是否合法
const isLegal = (row : number, column : number, board_score : Array<Array<number>>) => {
    if (! (column >= 0 && column < dimension && row >= 0 && row < dimension)) { //column与row都从0开始计算
        return false;
    }
    if(board_score[row][column] == 0) return false;
    else return true;
}
//AI策略执行
const AIplay = (board : Array<Array<string>>, pc_plays : string, board_score : Array<Array<number>>) => {
    const nowplay : string = pc_plays;
    var max_score : number = 0;
    var row : number = 0, column : number = 0;
    for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension; j++) {
            if (board_score[i][j] > max_score) {
                max_score = board_score[i][j];
                row = i; column = j;
            }
        }
    }
    if (max_score != 0) {
        board[row][column] = nowplay;
        cal_score(board, row, column, nowplay, true);
        console.log("Computer plays " 
                    + nowplay 
                    + " at " 
                    + String.fromCharCode("a".charCodeAt(0) + row)
                    + String.fromCharCode("a".charCodeAt(0) + column));
        return true;        //返回true表示执行成功
    } else {
        console.log(nowplay + " player has no valid move.")
        return false;
    }    //返回false表示无子可落
}
//无子可落判断函数
const hasValidMove = (board_score : Array<Array<number>>) => {
    for (let i = 0; i < dimension; ++i) {
        for (let j = 0; j < dimension; ++j){
            if (board_score[i][j] != 0){
                return true;
            }
        }
    }
    return false;
}
//胜负判断
const gameover = (board : Array<Array<string>>, nowplay : string) => {
    var nextplay : string = (nowplay == "X" ? "O" : "X");
    const board_score_nowplay : Array<Array<number>> = getBoardScore(board, nowplay);
    const board_score_nextplay : Array<Array<number>> = getBoardScore(board, nextplay);
    //双方都无子可落（被吃光和棋盘满可以合并到这个部分）
    var nowplay_count : number = 0, nextplay_count : number = 0;
    if (!hasValidMove(board_score_nowplay) && !hasValidMove(board_score_nextplay)) {
        console.log("Both players have no valid move.")
        console.log("Game Over.")
        for (let i = 0; i < dimension; ++i) {
            for (let j = 0; j < dimension; ++j) {
                if (board[i][j] == nowplay) nowplay_count ++;
                else if (board[i][j] == nextplay) nextplay_count ++;
            }
        }
        console.log(nowplay + " : " + nextplay + " = " + nowplay_count + " : " + nextplay_count);
        if (nowplay_count > nextplay_count) {
            console.log(nowplay + " player wins.")
        } else if (nowplay_count < nextplay_count) {
            console.log(nextplay + " player wins.")
        } else if (nowplay_count == nextplay_count) {
            console.log("Draws.")
        }
        return true;
    }
    return false;
}
//交换落子方的函数
const changeNowPlay = (nowplay : string) => (nowplay == "X") ? "O" : "X";
//计算双方棋子数目
const count = (board : Array<Array<string>>) => {
    var x_num : number = 0, o_num : number = 0;
    for (let i = 0; i < dimension; ++i) {
        for (let j = 0; j < dimension; ++j) {
            if (board[i][j] == 'X') x_num ++;
            else if (board[i][j] == 'O') o_num ++;
        }
    }
    return [x_num, o_num];
}
//******************主运行程序*****************

const rl = require('readline-sync');
const fs = require('fs')
// 确定棋盘规模
const dimension = rl.question('Enter the board dimension: ');
//确定PC执什么棋
const pc_plays = rl.question('Computer plays(X/O): ');

//棋盘初始化
var board : Array<Array<string>> = board_init(dimension)
//得分矩阵初始化
var board_score : Array<Array<number>> = board_score_init(dimension);
print_board(dimension, board);
var nowplay : string = "";
const start_time :number = Date.parse(new Date().toString());
var humangaveup : boolean = false;
if (pc_plays == "X") {
    nowplay = pc_plays;
    while (true) {
        //AI先下
        board_score = getBoardScore(board, nowplay);
        AIplay(board, pc_plays, board_score);
        print_board(dimension,board)
        if (gameover(board, nowplay)) {
            break;
        } else {
            nowplay = changeNowPlay(nowplay);
        }
        //人类再下
        board_score = getBoardScore(board, nowplay);
        var position : string = rl.question('Enter move for ' + nowplay + ' (RowCol): ');
        var position_row = position.charCodeAt(0) - 'a'.charCodeAt(0);
        var position_column = position.charCodeAt(1) - 'a'.charCodeAt(0);
        //先判断是否是合法位置
        if (!isLegal(position_row, position_column, board_score)) {
            console.log("Invalid move.");
            console.log("Game over.");
            console.log(pc_plays + " player wins.")
            humangaveup = true;
            break;
        } else {
            //落子并执行翻转
            board[position_row][position_column] = nowplay;
            cal_score(board, position_row, position_column, nowplay, true);
            print_board(dimension, board)
        }
        //每次落子完都进行一下胜负判断
        if (gameover(board, nowplay)) {
            break;
        }
        nowplay = changeNowPlay(nowplay);
    }
} else {
    //如果电脑执白则人类先下
    nowplay = changeNowPlay(pc_plays);
    while (true) {
        //人类先下
        board_score = getBoardScore(board, nowplay);
        var position : string = rl.question('Enter move for ' + nowplay + ' (RowCol): ');
        var position_row = position.charCodeAt(0) - 'a'.charCodeAt(0);
        var position_column = position.charCodeAt(1) - 'a'.charCodeAt(0);
        //先判断是否是合法位置
        if (!isLegal(position_row, position_column, board_score)) {
            console.log("Invalid move.");
            console.log("Game over.");
            console.log(pc_plays + " player wins.")
            humangaveup = true;
            break;
        } else {
            //落子并执行翻转
            board[position_row][position_column] = nowplay;
            cal_score(board, position_row, position_column, nowplay, true);
            print_board(dimension, board)
        }
        //每次落子完都进行一下胜负判断
        if (gameover(board, nowplay)) {
            break;
        }
        nowplay = changeNowPlay(nowplay)
        //AI后下
        board_score = getBoardScore(board, nowplay);
        AIplay(board, pc_plays, board_score);
        print_board(dimension, board)
        if (gameover(board, nowplay)) {
            break;
        } else {
            nowplay = changeNowPlay(nowplay);
        }
    }
}
//日志处理
const end_time :number = Date.parse(new Date().toString());
const used_time : number = end_time - start_time;
var [x_num , o_num] = count(board);
writeLog(formatDate(), used_time, dimension, pc_plays, pc_plays == "X" ? x_num : o_num, pc_plays == "O" ? x_num : o_num, humangaveup);
