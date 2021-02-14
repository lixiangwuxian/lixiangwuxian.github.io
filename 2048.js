///x->0 1 2 3
///y0
///|1
///|2
///v3
///map[x][y]

var ifend=false;
var map=[];
var map_replay=[];
var step=0;
var score=0;
var ifnewnum=[];
var score_replay=[];

function keydown(the_key)//按键检测
{
    if(the_key.keyCode == 38||the_key.keyCode == 87)//上键或w键
    {
        movup();
    }
    else if(the_key.keyCode == 40||the_key.keyCode == 83)
    {
        movdown();
    }
    else if(the_key.keyCode == 37||the_key.keyCode == 65)
    {
        movleft();
    }
    else if(the_key.keyCode == 39||the_key.keyCode == 68)
    {
        movright();
    }
    document.addEventListener("keydown",keydown);
}

function save_replay()
{
    map_replay[step]=[[],[],[],[]];//初始化表格
    for(var x=0;x<4;x++)
    {
        for(var y=0;y<4;y++)
        {
            map_replay[step][x][y]=map[x][y];
        }
    }
}

function addblock(n)//随机生成n个2或4
{
    while(n > 0)
    {
		var ifadded = insert_one();
		if (!ifadded)
			break;//满了不加
		n--;
	}
}

function insert_one()//随机插入一个2或4，有空格子返回未插入
{
	var if_inserted = if_has_empty();
    while(if_inserted)
    {
        var x = Math.floor(Math.random()*4);
		var y = Math.floor(Math.random()*4);
        if (map[x][y] == 0)
        {
			map[x][y]=1+Math.floor(Math.random()*1.7);
			break;
		}
	}
	return if_inserted;
}

function if_has_empty()//检测是否有空格子
{
	var ifempty = false;
    for(var x = 0; x < 4; x++)
    {
        for(var y = 0; y < 4; y++)
        {
            if (map[x][y] == 0)
            {
                ifempty = true;
                return ifempty;
            }
		}
	}
	return ifempty;
}

function init()//初始化4x4地图
{
    step=0;
    score=0;
    map_replay=[];
    ifend=false;
    for (var i=0;i<4;i++)
    {
        var mapy=[];
        for (var j=0;j<4;j++)
        {
            mapy[j]=0;
        }
        map[i]=mapy;
    }
    addblock(2);
    output_html();
}

function movup()
{
    clearnum();
    step++;
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
                        map[x][y-k]++;
                        ifnewnum[x][y-k]=true;
                        score+=map[x][y];//加分
                        map[x][y]=0;
                        break;
                    }
                    else if(map[x][y-k]!=0)//不能合并，向上移动同时防止误清
                    {
                        if(k>1)
                        {
                            map[x][y-k+1]=map[x][y];
                            map[x][y]=0;
                        }
                        break;
                    }
                    else if(k==y)
                    {
                        map[x][0]=map[x][y];
                        map[x][y]=0;
                    }
                }
            }
        }
    }
    if(!ifend)
        addblock(Math.floor(Math.random()*1.5)+1);//添加1-2个数字各
    checkifend();
    output_html();
}

function movdown()
{
    clearnum();
    step++;
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
                        map[x][y+k]++;
                        ifnewnum[x][y+k]=true;
                        score+=map[x][y];
                        map[x][y]=0;
                        break;
                    }
                    else if(map[x][y+k]!=0)
                    {
                        if(k>1)
                        {
                            map[x][y+k-1]=map[x][y];
                            map[x][y]=0;
                        }
                        break;
                    }
                    else if(k+y==3)
                    {
                        map[x][3]=map[x][y];
                        map[x][y]=0;
                    }
                }
            }
        }
    }
    if(!ifend)
        addblock(Math.floor(Math.random()*1.5)+1);
    checkifend();
    output_html();
}

function movleft()
{
    clearnum();
    step++;
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
                        map[x-k][y]++;
                        ifnewnum[x-k][y]=true;
                        score+=map[x][y];//加分
                        map[x][y]=0;
                        break;
                    }
                    else if(map[x-k][y]!=0)//不能合并，向上移动同时防止误清
                    {
                        if(k>1)
                        {
                            map[x-k+1][y]=map[x][y];
                            map[x][y]=0;
                        }
                        break;
                    }
                    else if(k==x)
                    {
                        map[0][y]=map[x][y];
                        map[x][y]=0;
                    }
                }
            }
        }
    }
    if(!ifend)
        addblock(Math.floor(Math.random()*1.5)+1);
    checkifend();
    output_html();
}

function movright()
{
    clearnum();
    step++;
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
                        map[x+k][y]++;
                        ifnewnum[x+k][y]=true;
                        score+=map[x][y];
                        map[x][y]=0;
                        break;
                    }
                    else if(map[x+k][y]!=0)
                    {
                        if(k>1)
                        {
                            map[x+k-1][y]=map[x][y];
                            map[x][y]=0;
                        }
                        break;
                    }
                    else if(k+x==3)
                    {
                        map[3][y]=map[x][y];
                        map[x][y]=0;
                    }
                }
            }
        }
    }
    if(!ifend)
        addblock(Math.floor(Math.random()*1.5)+1);
    checkifend();
    output_html();
}

function checkifend()
{
    var iffull=true;
    var ifmovable=false;
    var if2048exist=false;
    for(var x=0;x<4;x++)
    {
        for(var y=0;y<4;y++)
        {
            if(map[x][y] == 0)
            {
                iffull=false;
            }
            if(map[x][y] == 11)
            {
                if2048exist=true;
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
						ifmovable=true;
				}
				catch(e){}				
                try
                {
					if (map[x][y]==map[x][y-1])
                        ifmovable=true;
				}
				catch(e){}				
                try
                {
					if (map[x][y]==map[x-1][y])
                        ifmovable=true;
				}
                catch(e){}                
                try
                {
					if (map[x][y]==map[x+1][y])
                        ifmovable=true;
				}
                catch(e){}                
            }
        }
    }
    if((ifmovable==false&&iffull)||if2048exist)
    {
        ifend=true;
    }
}

function output_html()
{
    
    save_replay();
    score_replay[step]=score;
    for(var x=0;x<4;x++)
    {
        for(var y=0;y<4;y++)
        {
            update_pos(x,y,map[x][y]);
        }
    }
    if(ifend)//结束游戏输出
    {
        window.alert("游戏结束，您的分数:"+score);
    }
    score2update=document.getElementById("score");
    score2update.innerHTML=score;
}

function update_pos(x,y,value)
{
    var map2word=[['p00','p01','p02','p03'],['p10','p11','p12','p13'],['p20','p21','p22','p23'],['p30','p31','p32','p33']];
    var value2word=['/pic/0.jpg','/pic/2.jpg','/pic/4.jpg','/pic/8.jpg','/pic/16.jpg','/pic/32.jpg','/pic/64.jpg','/pic/128.jpg','/pic/256.jpg','/pic/512.jpg','/pic/1024.jpg','/pic/2048.jpg'];
    img2update=document.getElementById(map2word[y][x]);
    img2update.src=value2word[value];
}

function map_replay_f()
{
    var i=0;
    var replaying=window.setInterval(function replay_fc()
    {
        try
        {
            for(var x=0;x<4;x++)
            {
                for(var y=0;y<4;y++)
                {
                    update_pos(x,y,map_replay[i][x][y]);
                }
            }
        score2update=document.getElementById("score");
        score2update.innerHTML=score_replay[i];
        }
        catch(e)
        {
            window.alert("回放完毕");
            window.clearInterval(replaying);
        }
        i++;
    }
    ,500);;
}

function clearnum()
{
    ifnewnum=[[],[],[],[]];
    for(var x=0;x<4;x++)
    {
        for(var y=0;y<4;y++)
        {
            ifnewnum[x][y]=false;
        }
    }
}
