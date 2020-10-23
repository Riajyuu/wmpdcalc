const addBtn = document.getElementById("AddBtn"),
	submitBtn = document.getElementById("submitBtn"),
	result = document.getElementById("result"),
	allInputDOM = document.querySelectorAll("input");

let wmpCount = 2;

const addWmp = function () {
	const wmpSet = document.getElementById("wmpSet"),
		div = document.createElement("div"),
		label = document.createElement("label"),
		input = document.createElement("input"),
		delBtn = document.createElement("button");

	wmpCount++;
	label.setAttribute("for", `拼单 ${wmpCount}`);
	input.id = input.name = label.textContent = `拼单 ${wmpCount}`;
	input.type = "text";
	delBtn.type = "button";
	delBtn.textContent = "删除";
	delBtn.onclick = function () {
		const wmpSet = document.getElementById("wmpSet");
		wmpSet.removeChild(this.parentNode);
		let inputWraps = Array.from(wmpSet.childNodes).filter( ele => ele.className === "inputWrap" );
		inputWraps.forEach((wrap, index) => {
			wrap.children[0].setAttribute("for", `拼单 ${index + 1}`);
			wrap.children[0].textContent = `拼单 ${index + 1}`;
			wrap.children[1].name = wrap.children[1].id = `wmp${index + 1}`;
		});
		wmpCount--;
	};
	div.className = "inputWrap";
	div.appendChild(label);
	div.appendChild(input);
	div.appendChild(delBtn);
	wmpSet.appendChild(div);
	input.focus();
}

const numFix = function (num) {
	return parseFloat(parseFloat(String(num).replace(/[^\d\-]/g,"")).toFixed(14));
};

const getPointFormat = function (num,len) {
	num = numFix(num);
	len = parseInt(len);
	if (len < 0 ) {
		return num;
	}
	let tmp1 = Math.pow(10,len + 2),
		tmp2 = String(Math.abs(Math.ceil(num * tmp1) / 100).toFixed(2)).split(".");
	if (tmp2.length === 1) {
		return num.toFixed(len);
	}
	tmp2[0] = parseInt(tmp2[0]);
	let tmp3 = parseFloat(tmp2[1]) / 100;
	if (tmp3 > 0.5) {
		tmp2[0] = parseInt(tmp2[0]) + 1;
	} else if (tmp3 === 0.5 && parseInt(String(tmp2[0])[String(tmp2[0]).length - 1]) % 2 === 1) {
		tmp2[0] = parseInt(tmp2[0]) + 1;
	}
	return (tmp2[0] * 100 / tmp1 * (num < 0 ? - 1 : 1)).toFixed(len);
};

const getResult = function (order, priceAfterDiscount, price, delivery, deliveryCalcMethod, count) {
	// 不含配送费的折扣比例
	let orderProportion = (priceAfterDiscount - delivery) / (price - delivery),
		// 拼单配送费
		orderDelivery = deliveryCalcMethod ? (order / (price - delivery) * delivery) : (delivery / count),
		// 拼单实付
		orderPrice = (getPointFormat((orderProportion * order + orderDelivery) * 100) / 100).toFixed(2),

		orderProportionTex = `\\left( ${priceAfterDiscount} - ${delivery} \\right) \\div \\left( ${price} - ${delivery} \\right)`,
		orderPriceTex = deliveryCalcMethod ? `${orderProportionTex} \\times ${order} + ${order} \\div \\left( ${price} - ${delivery} \\right) \\times ${delivery}` : `${orderProportionTex} \\times ${order} + \\left( ${delivery} \\div ${count} \\right)`;

	return `${orderPriceTex} = ${orderPrice}`;
};

const calc = function (value) {
	let orders = value,
		priceAfterDiscount = document.getElementById("priceAfterDiscount").value,
		price = document.getElementById("price").value,
		delivery = document.getElementById("delivery").value,
		deliveryCalcMethod = ~~(document.getElementById("calcMethod").value);

	for (let i = 0; i < orders.length; i++) {
		let tex = getResult(orders[i], priceAfterDiscount, price, delivery, deliveryCalcMethod, orders.length);
		result.innerHTML += '<p>拼单 ' + (i + 1) + '：</p><p><img alt="" src="https://www.zhihu.com/equation?tex=' + encodeURIComponent("\\begin{align*}" + tex + "\\end{align*}") + "\" /></p>";
	}
};

const submit = function () {
	let values = [],
		inputArr = Array.from(allInputDOM);
	inputArr.forEach((input, index) => {
		if (typeof input.value === "number" && input.value.toString().length <= 16) {
			calc(values);
		} else {
			result.textContent = "值错误，只允许输入数字，数字总长度不允许超过 16 位";
			inputArr[index].focus();
		}
	})
};

addBtn.addEventListener("click", addWmp);
submitBtn.addEventListener("click", submit);