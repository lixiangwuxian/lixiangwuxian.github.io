///x->0 1 2 3
///y0
///|1
///|2
///v3
///map[x][y]

var ifend=false
var map=[]
var map_replay=[]
var step=0
var score=0
var ifnewnum=[]
var score_replay=[]
var replaying

function stop_replay()//有按键或按钮输入则停止回放
{
    try
    {
        window.clearInterval(replaying)
    }
    catch(e)
    {}
}

function undo()//撤销
{
    stop_replay()
    try
    {
        if(ifend)
        {
            ifend=false
        }
        else
        {
            step--
        }
        for(var x=0;x<4;x++)
        {
            for(var y=0;y<4;y++)
            {
                map[x][y]=map_replay[step][x][y]
            }
        }
        score=score_replay[step]
        output_html()
    }
    catch(e)
    {
        window.alert("撤到头了！")
        step++
    }
}

function keydown(the_key)//按键检测
{
    stop_replay();//有按键输入则中断回放
    if(the_key.keyCode == 38||the_key.keyCode == 87)//上键或w键
    {
        movup()
    }
    else if(the_key.keyCode == 40||the_key.keyCode == 83)
    {
        movdown()
    }
    else if(the_key.keyCode == 37||the_key.keyCode == 65)
    {
        movleft()
    }
    else if(the_key.keyCode == 39||the_key.keyCode == 68)
    {
        movright()
    }
    document.addEventListener("keydown",keydown);//接收下一个按键输入
}

function save_replay()//每次移动后保存状态
{
    map_replay[step]=[[],[],[],[]];//初始化地图
    for(var x=0;x<4;x++)
    {
        for(var y=0;y<4;y++)
        {
            map_replay[step][x][y]=map[x][y]
        }
    }
}

function add_block(n)//随机生成n个2或4
{
    while(n > 0)
    {
		var ifadded = insert_one()
		if (!ifadded)
			break;//满了不加
		n--
	}
}

function insert_one()//随机插入一个2或4，有空格子返回未插入
{
	var if_inserted = if_has_empty();//检测是否有空格子
    while(if_inserted)
    {
        var x = Math.floor(Math.random()*4)
		var y = Math.floor(Math.random()*4)
        if (map[x][y] == 0)
        {
			map[x][y]=1+Math.floor(Math.random()*1.7);//生成4的概率较小
			break
		}
	}
	return if_inserted
}

function if_has_empty()//检测是否有空格子
{
	var ifempty = false
    for(var x = 0; x < 4; x++)
    {
        for(var y = 0; y < 4; y++)
        {
            if (map[x][y] == 0)
            {
                ifempty = true
                return ifempty
            }
		}
	}
	return ifempty
}

function init()//初始化4x4地图
{
    step=0
    score=0
    map_replay=[]
    ifend=false
    for (var i=0;i<4;i++)
    {
        var mapy=[]
        for (var j=0;j<4;j++)
        {
            mapy[j]=0
        }
        map[i]=mapy
    }
    add_block(2);//初始必定生成两个数
    output_html();//刷新地图
}

function check_moved()//检测按下某键后是否发生了移动
{
    try
    {
        var ifmoved=false
        for (var x = 0; x < 4; x++)
        {
            for(var y=0;y<4;y++)
            {
                if(map_replay[step-1][x][y]!=map[x][y])
                {
                    ifmoved=true
                }
            }
        }
        return ifmoved
    }
    catch(e)
    {
        return true;//第一次检测会抛出异常，故直接返回true
    }
}

function movup()//向上移动
{
    clearnum()
    step++
    for(var y=1;y<4;y++)//逐行遍历，由上至下，由左至右，先纵后横
    {
        for(var x=0;x<4;x++)
        {
            if(map[x][y]!=0&&!ifend)
            {
                for(var k=1;k<=y;k++)
                {
                    if(map[x][y-k]==map[x][y]&&ifnewnum[x][y-k]==false)//能合并
                    {
                        map[x][y-k]++
                        ifnewnum[x][y-k]=true
                        score+=Math.pow(2,map[x][y]-1)//加分
                        map[x][y]=0
                        break
                    }
                    else if(map[x][y-k]!=0)//不能合并，向上移动同时防止误清
                    {
                        if(k>1)
                        {
                            map[x][y-k+1]=map[x][y]
                            map[x][y]=0
                        }
                        break
                    }
                    else if(k==y)
                    {
                        map[x][0]=map[x][y]
                        map[x][y]=0
                    }
                }
            }
        }
    }
    if(!ifend&&check_moved())
        add_block(Math.floor(Math.random()*1.5)+1);//添加1-2个数字各
    checkifend()
    output_html()
}

function movdown()
{
    clearnum()
    step++
    for(var y=2;y>=0;y--)
    {
        for(var x=0;x<4;x++)
        {
            if(map[x][y]!=0&&!ifend)
            {
                for(var k=1;k<=3-y;k++)
                {
                    if(map[x][y+k]==map[x][y]&&ifnewnum[x][y+k]==false)
                    {
                        map[x][y+k]++
                        ifnewnum[x][y+k]=true
                        score+=Math.pow(2,map[x][y]-1)
                        map[x][y]=0
                        break
                    }
                    else if(map[x][y+k]!=0)
                    {
                        if(k>1)
                        {
                            map[x][y+k-1]=map[x][y]
                            map[x][y]=0
                        }
                        break
                    }
                    else if(k+y==3)
                    {
                        map[x][3]=map[x][y]
                        map[x][y]=0
                    }
                }
            }
        }
    }
    if(!ifend&&check_moved())
        add_block(Math.floor(Math.random()*1.5)+1)
    checkifend()
    output_html()
}

function movleft()
{
    clearnum();//初始化新生成数字的检测
    step++
    for(var x=1;x<4;x++)
    {
        for(var y=0;y<4;y++)
        {
            if(map[x][y]!=0&&!ifend)
            {
                for(var k=1;k<=x;k++)
                {
                    if(map[x-k][y]==map[x][y]&&ifnewnum[x-k][y]==false)//能合并
                    {
                        map[x-k][y]++
                        ifnewnum[x-k][y]=true
                        score+=Math.pow(2,map[x][y]-1)//加分
                        map[x][y]=0
                        break
                    }
                    else if(map[x-k][y]!=0)//不能合并，向上移动同时防止误清
                    {
                        if(k>1)
                        {
                            map[x-k+1][y]=map[x][y]
                            map[x][y]=0
                        }
                        break
                    }
                    else if(k==x)
                    {
                        map[0][y]=map[x][y]
                        map[x][y]=0
                    }
                }
            }
        }
    }
    if(!ifend&&check_moved())
        add_block(Math.floor(Math.random()*1.5)+1)
    checkifend()
    output_html()
}

function movright()
{
    clearnum()
    step++
    for(var x=2;x>=0;x--)
    {
        for(var y=0;y<4;y++)
        {
            if(map[x][y]!=0&&!ifend)
            {
                for(var k=1;k<=3-x;k++)
                {
                    if(map[x+k][y]==map[x][y]&&ifnewnum[x+k][y]==false)
                    {
                        map[x+k][y]++
                        ifnewnum[x+k][y]=true
                        score+=Math.pow(2,map[x][y]-1)
                        map[x][y]=0
                        break
                    }
                    else if(map[x+k][y]!=0)
                    {
                        if(k>1)
                        {
                            map[x+k-1][y]=map[x][y]
                            map[x][y]=0
                        }
                        break
                    }
                    else if(k+x==3)
                    {
                        map[3][y]=map[x][y]
                        map[x][y]=0
                    }
                }
            }
        }
    }
    if(!ifend&&check_moved())
        add_block(Math.floor(Math.random()*1.5)+1)
    checkifend()
    output_html()
}

function checkifend()//检查游戏是否结束
{
    var iffull=true
    var ifmovable=false
    var if2048exist=false
    for(var x=0;x<4;x++)
    {
        for(var y=0;y<4;y++)
        {
            if(map[x][y] == 0)
            {
                iffull=false
            }
            if(map[x][y] == 11)
            {
                if2048exist=true
            }
        }
    }
    if(iffull)
    {
        for(var x=0;x<4;x++)
        {
            for(var y=0;y<4;y++)
            {
                try
                {
					if (map[x][y]==map[x][y+1])
						ifmovable=true
				}
				catch(e){}				
                try
                {
					if (map[x][y]==map[x][y-1])
                        ifmovable=true
				}
				catch(e){}				
                try
                {
					if (map[x][y]==map[x-1][y])
                        ifmovable=true
				}
                catch(e){}                
                try
                {
					if (map[x][y]==map[x+1][y])
                        ifmovable=true
				}
                catch(e){}                
            }
        }
    }
    if((ifmovable==false&&iffull)||if2048exist)
    {
        ifend=true
    }
}

function output_html()//改变html中元素的值
{
    
    if(check_moved())
    {
        save_replay()
        score_replay[step]=score
        for(var x=0;x<4;x++)
        {
            for(var y=0;y<4;y++)
            {
                update_pos(x,y,map[x][y])
            }
        }
    }
    else
        step--
    if(ifend)//结束游戏输出
    {
        for(var x=0;x<4;x++)
        {
            for(var y=0;y<4;y++)
            {
                update_pos(x,y,map[x][y])
            }
        }
    }
    score2update=document.getElementById("score")
    score2update.innerHTML=score+"分"
    step2update=document.getElementById("step")
    step2update.innerHTML=step+"步"
    if(ifend)
    {
        step--;
        window.alert("游戏结束，您的分数:"+score)
    }
}

function update_pos(x,y,value)//改变座标上对应图片的显示
{
    var map2word=[['p00','p01','p02','p03'],['p10','p11','p12','p13'],['p20','p21','p22','p23'],['p30','p31','p32','p33']]
    var value2word=['/pic/0.jpg','/pic/2.jpg','/pic/4.jpg','/pic/8.jpg','/pic/16.jpg','/pic/32.jpg','/pic/64.jpg','/pic/128.jpg','/pic/256.jpg','/pic/512.jpg','/pic/1024.jpg','/pic/2048.jpg']
    img2update=document.getElementById(map2word[y][x])
    img2update.src=value2word[value]
}

function map_replay_f()//游戏过程回放
{
    var i=0
    replaying=window.setInterval(function replay_fc()
    {
        if(i>step)
        {
            window.alert("回放完了！")
            window.clearInterval(replaying)
        }
        else
        {
            try
            {

                for(var x=0;x<4;x++)
                {
                    for(var y=0;y<4;y++)
                    {
                        update_pos(x,y,map_replay[i][x][y])
                    }
                }
                score2update=document.getElementById("score")
                score2update.innerHTML=score_replay[i]+"分"
                step2update=document.getElementById("step")
                step2update.innerHTML=i+"步"
            }
            catch(e)
            {
                window.alert("回放完毕")
                window.clearInterval(replaying)
            }
            i++//步进
        }
    }
    ,500)
}

function clearnum()//初始化4×4新生成数字的检测
{
    ifnewnum=[[],[],[],[]]
    for(var x=0;x<4;x++)
    {
        for(var y=0;y<4;y++)
        {
            ifnewnum[x][y]=false
        }
    }
}