import config from "./config";
const ajax = async (data) => {
	uni.showLoading({
		title:'加载中..'
	})
	try {	
		if(data)
		{
			data = config.encode(data);
		}
		let res;
		if(typeof wx !== 'undefined')
		{
			res = await uni.request({
				url: config.host + 'index.php',
				header: {
					'content-type': 'application/x-www-form-urlencoded',
					'app-agent':'phpemsapkinterface',
					'cookie':'path=/;' + uni.getStorageSync('cookie')
				},
				method: 'POST',
				data:{userhash:Math.random(),...data}
			});
			if(res.cookies.length >= 1 && data.route.indexOf('login') >= 0)
			{
				let cookie = res.cookies.join(';');
				uni.setStorageSync('cookie',cookie);
			}
		}
		else
		{			
			res = await uni.request({
				url: config.host + 'index.php',
				header: {
					'content-type': 'application/x-www-form-urlencoded',
					'app-agent':'phpemsapkinterface'
				},
				method: 'POST',
				withCredentials: true,
				data:{userhash:Math.random(),...data}
			})
		}
		uni.hideLoading();
		res.data.data = config.decode(res.data.data);
		if(res.data.statusCode == 301){
			uni.navigateTo({
				url:'/pages/user/login'
			})
		}else{
			return res.data;
		}
	}catch(err) {
		console.error('请求失败:', err);
	}
}
export default ajax; 