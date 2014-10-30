var income_radio_result;			// [パート収入]ラジオの値
var income_value = 0;				// [パート収入]テキストの値
var income_value_check_flg;			// [パート収入]テキストの数値チェックの結果
var income_flg;						// [パート収入]処理フラグ

var social_health = 0;				// [社会保険]健康保険料
var social_pension = 0;				// [社会保険]公的年金保険料
var social_chk1;					// [社会保険]チェックボックス1の値
var social_chk2;					// [社会保険]チェックボックス2の値
var social_chk3;					// [社会保険]チェックボックス3の値
var social_chk4;					// [社会保険]チェックボックス4の値
var social_standard;				// [社会保険]標準報酬
var social_premium_rate1 = 0.0997;	// [社会保険]一般保険料率（協会けんぽ　H25.9～　東京）
var social_premium_rate2 = 0.0155;	// [社会保険]介護保険料率（協会けんぽ　H25.9～　東京）
var social_premium_rate3 = 0.1712;	// [社会保険]厚生年金保険料率（H25.9～）
var social_basis_amount;			// [社会保険]算定基礎額
var social_medical;					// [社会保険]国民健康保険：医療分
var social_funding;					// [社会保険]国民健康保険：支援金分
var social_care;					// [社会保険]国民健康保険：介護分
var social_national1 = 3.06;		// [社会保険]国民健康保険料（医療分：H25 新宿区）
var social_national2 = 1.08;		// [社会保険]国民健康保険料（支援金分：H25 新宿区）
var social_national3 = 1.5;			// [社会保険]国民健康保険料（介護分：H25 新宿区）
var social_national_rate1 = 0.0602;	// [社会保険]国民健康保険料率（医療分：H25 新宿区）
var social_national_rate2 = 0.0234;	// [社会保険]国民健康保険料率（支援金分：H25 新宿区）
var social_national_rate3 = 0.0164;	// [社会保険]国民健康保険料率（介護分：H25 新宿区）

var employment = 0;					// [雇用保険]雇用保険料
var employment_chk1;				// [雇用保険]チェックボックス1の値
var employment_chk2;				// [雇用保険]チェックボックス2の値
var employment_chk3;				// [雇用保険]チェックボックス3の値

var deduction_salary = 65;			// [控除]給与控除
var deduction_basic_income = 38;	// [控除]基礎控除：所得税
var deduction_basic_resident = 33;	// [控除]基礎控除：住民税
var deduction_social_insurance = 0;	// [控除]社会保険料

var mom_taxable_income_amount;		// [ママ追加分]課税所得金額
var mom_taxable_income_amount2;		// [ママ追加分]課税所得金額
var mom_income_tax = 0;				// [ママ追加分]所得税
var mom_resident_tax = 0;			// [ママ追加分]住民税
var mom_income_percent;				// [ママ追加分]所得割
var mom_capita_rate = 0.4;			// [ママ追加分]均等割

var papa_withholding_slip_value1;	// [パパ追加分]源泉徴収票（給与所得控除の金額）
var papa_withholding_slip_value2;	// [パパ追加分]源泉徴収票（所得控除の額の合計額）
var papa_flg;						// [パパ追加分]処理フラグ
var papa_msg;						// [パパ追加分]エラーメッセージ
var papa_value_check_flg1;			// [パパ追加分]数値チェック結果
var papa_value_check_flg2;			// [パパ追加分]数値チェック結果
var papa_value_check_flg3;			// [パパ追加分]数値チェック結果
var papa_value_check_flg4;			// [パパ追加分]数値チェック結果
var papa_income_tax_before = 0;		// [パパ追加分]所得税（パート前）
var papa_income_tax_after = 0;		// [パパ追加分]所得税（パート後）
var papa_income_tax = 0;			// [パパ追加分]所得税
var papa_resident_tax = 0;			// [パパ追加分]住民税
var papa_allowance = 0;				// [パパ追加分]配偶者手当減少額
var papa_other = 0;					// [パパ追加分]保育料その他

var income_input_flg = false;
var social_input_flg = false;
var employment_input_flg = false;
var mom_input_flg = false;
var papa_input_flg = false;

var fixed_flg = false;				// 修正ボタンを押したかどうか判定
var fixed_array = [];

var totalAmount;					// 追加の負担金合計

$(function() {
	// Header 部の表示（初期化）
	totalAddMoney();

	// [パート収入]ラジオ選択時の挙動
	$('#income_r_1').click(function() {$('#income_m').css('display', '');});
	$('#income_r_2').click(function() {$('#income_m').css('display', 'none');});

	// [パート収入]の処理
	$('#income_button').click(function() {
		processPartRevenue();
	});

	// [社会保険]の処理
	$('#social_button').click(function() {
		processSocialInsurance();
	});

	// [雇用保険]の処理
	$('#employment_button').click(function() {
		processEmploymentInsurance();
	});

	// [ママ追加分]の処理
	$('#mom_increase_button').click(function() {
		processMomInsurance();
	});

	// [パパ追加分]の処理
	$('#papa_increase_button').click(function() {
		processPapaInsurance();
	});
});

// [パート収入]の処理
function processPartRevenue() {
	// 注意が表示されている場合は削除
	$('.attention').remove();

	// 処理フラグ:true
	income_flg = true;

	// radio の値を取得
	income_radio_result = $('input[name="r1"]:checked').val();

	// text の値尾を取得し、数値チェック
	income_value = $('#income_t').val();
	income_value_check_flg = $.isNumeric(income_value);

	// text の値が数値ではない時の処理
	if(!income_value_check_flg) {
		$('#add_attention').append('<div class="attention">数値を入力してください。</div>');
		income_flg = false;
	}

	// パート収入確定
	if(income_flg) {
		if(income_radio_result == "m") {
			income_value = income_value * 12
		}

		// slideUp + 修正ボタンを作成
		createFixedButton('income');

		// [社会保険]の処理
		if(!income_input_flg) {
			nextSlideDown('social');
		}

		// Header 部の表示
		totalAddMoney();

		// 修正ボタンからこの処理に入っている場合
		if(fixed_flg) {
			fixed_flg = false;
			allProcss();
		}
	}
}

// [社会保険]の処理
function processSocialInsurance() {
	// 適用されるかチェック（パート収入が130万円未満の場合は0
	if(income_value < 130) {
		social_health = 0;
		social_pension = 0;

//		alert('パート収入が130万円未満の場合、健康保険料・公的年金保険料は追加でかかりません。');
	} else {
		// チェックボックスの値を取得
		social_chk1 = $('#social_c_1:checked').val();
		social_chk2 = $('#social_c_2:checked').val();
		social_chk3 = $('#social_c_3:checked').val();
		social_chk4 = $('#social_c_4:checked').val();

		// 2ヶ月以内の雇用期間の場合、社会保険の負担額は増加されない
		if(social_chk1 == 'sc1') {
			social_health = 0;
			social_pension = 0;
		} else {
			if(social_chk2 == 'sc2' && social_chk3 == 'sc3') {
				// 標準報酬を取得
				social_standard = getStandardRemuneration();

				// 健康保険料の計算
				// H25 協会健保の東京の保険料率を参照
				// 標準報酬月額⇒取りあえずは月収入予定額で計算
				if(social_chk4 == 'sc4') {
					// 40歳以上：(標準報酬月額×一般保険料率+標準報酬月額×介護保険料率)×0.5
					social_health = social_standard * (social_premium_rate1 + social_premium_rate2) * 0.5 * 12;
				} else {
					// 40歳未満：標準報酬月額×一般保険料率×0.5
					social_health = social_standard * social_premium_rate1 * 0.5 * 12;
				}

				// 厚生年金保険料の計算
				// 標準報酬月額×保険料率×0.5
				social_pension = social_standard * social_premium_rate3 * 0.5 * 12;
			} else {
				// 国民健康保険料の計算
				social_basis_amount = income_value - 33;

				// 医療分
				social_medical = (social_basis_amount * social_national_rate1) + social_national1;
				if(social_medical > 51) {
					social_medical = 51;
				}

				// 後期高齢者支援金分
				social_funding = (social_basis_amount * social_national_rate2) + social_national2;
				if(social_funding > 14) {
					social_funding = 14;
				}

				// 40歳以上
				if(social_chk4 == 'sc4') {
					// 介護分
					social_care = (social_basis_amount * social_national_rate3) + social_national3;
					if(social_care > 12) {
						social_care = 12;
					}
				} else {
					social_care = 0;
				}

				social_health = social_medical + social_funding + social_care;

				// 国民年金
				social_pension = 18;
			}
		}
	}

	// [雇用保険]の処理
	if(!social_input_flg) {
		income_input_flg = true;
		nextSlideDown('employment');
	}

	// slideUp + 修正ボタンを作成
	createFixedButton('social');

	// Header 部の表示
	totalAddMoney();

	// 詳細表示
	$('#social_result').slideDown('slow');

	// 修正ボタンからこの処理に入っている場合
	if(fixed_flg) {
		fixed_flg = false;
		allProcss();
	}
}

// [雇用保険]の処理
function processEmploymentInsurance() {
	// チェックボックスの値を取得
	employment_chk1 = $('#employment_c_1:checked').val();
	employment_chk2 = $('#employment_c_2:checked').val();
	employment_chk3 = $('#employment_c_3:checked').val();

	if(employment_chk1 == 'ec1' && employment_chk2 == 'ec2' || employment_chk3 == 'ec3') {
		// 月額賃金総額 × 0.5% * 12ヶ月
		employment = income_value * 0.005;
	} else {
		employment = 0;
	}

	// [ママ追加分]の処理
	if(!employment_input_flg) {
		social_input_flg = true;
		nextSlideDown('mom_increase');
	}

	// slideUp + 修正ボタンを作成
	createFixedButton('employment');

	// Header 部の表示
	totalAddMoney();

	// 詳細表示
	$('#employment_result').slideDown('slow');

	// 修正ボタンからこの処理に入っている場合
	if(fixed_flg) {
		fixed_flg = false;
		allProcss();
	}
}

// [ママ追加分]の処理
function processMomInsurance() {
	// 130万円以上の所得の場合は社会保険料を控除する
	if(income_value >= 130) {
		deduction_social_insurance = social_health + social_pension + employment;
	} else {
		deduction_social_insurance = 0;
	}
	
	// 課税所得金額の計算
	mom_taxable_income_amount = income_value - (deduction_salary + deduction_basic_income + deduction_social_insurance);
	
	if(mom_taxable_income_amount < 0) {
		mom_taxable_income_amount = 0;
	}

	// 所得税の計算
	mom_income_tax = getIncomeTax(mom_taxable_income_amount);

	// 住民税の計算
	// 住民税　= 所得割 + 均等割
	// 所得割 = 都道府県民税 + 市区町村税
	// 課税標準額 = 課税所得 - 65万円（給与所得控除） - 33万円（基礎控除）
	// 人的控除額（基礎控除額）の差 = 38万円（所得税の基礎控除額） - 33万円（住民税の基礎控除額）
	// 都道府県民税 ： 調整控除前の税額 = 課税標準額 * 4%（税率：一律）
	// 　　　　　　　　　   調整控除 = 人的控除額（基礎控除額）の差 * 2%
	// 　　　　　　　　　   都道府県民税 = 調整控除前の税額 - 調整控除
	// 市区町村民税 ： 調整控除前の税額 = 課税標準額 * 6%（税率：一律）
	// 　　　　　　　　　   調整控除 = 人的控除額（基礎控除額）の差 * 3%
	// 　　　　　　　　　   市区町村民税 = 調整控除前の税額 - 調整控除
	// 均等割 = 都道府県民税(0.1万円) + 市区町村民税（0.3万円）
	
	if(income_value > 100) {
		// 課税標準額
		mom_taxable_income_amount2 = income_value - (deduction_salary + deduction_basic_resident + deduction_social_insurance);

		// 所得割
		mom_income_percent = mom_taxable_income_amount2 * 0.1 - 5 * 0.05

		// 住民税
		mom_resident_tax = mom_income_percent + mom_capita_rate;
	} else {
		mom_resident_tax = 0;
	}

	// [ママ追加分]の処理
	if(!mom_input_flg) {
		employment_input_flg = true;
		nextSlideDown('papa_increase');
	}

	// slideUp + 修正ボタンを作成
	createFixedButton('mom_increase');

	// Header 部の表示
	totalAddMoney();

	// 詳細表示
	$('#mom_increase_result').slideDown('slow');

	// 修正ボタンからこの処理に入っている場合
	if(fixed_flg) {
		fixed_flg = false;
		allProcss();
	}
}

// [パパ追加分]の処理
function processPapaInsurance() {
	// 注意が表示されている場合は削除
	$('.attention').remove();

	// 処理フラグ:true
	papa_flg = true;
	papa_msg = '';

	// 給与所得控除の金額
	papa_withholding_slip_value1 = $('#papa_increase_t_1').val();
	papa_value_check_flg1 = $.isNumeric(papa_withholding_slip_value1);
	if(!papa_value_check_flg1) {
		papa_msg = '[給与所得控除の金額]';
	}

	// 所得控除の額の合計額
	papa_withholding_slip_value2 = $('#papa_increase_t_2').val();
	papa_value_check_flg2 = $.isNumeric(papa_withholding_slip_value2);
	if(!papa_value_check_flg2) {
		papa_msg += '[所得控除の額の合計額]';
	}

	// ママパート前の所得税額
	papa_income_tax_before = (papa_withholding_slip_value1 - papa_withholding_slip_value2) / 10000;
	papa_income_tax_before = getIncomeTax(papa_income_tax_before);

	// ママパート後の所得税額
	papa_income_tax_after = (papa_withholding_slip_value1 - papa_withholding_slip_value2) / 10000 + getDecreaseSpousalDeduction();
	papa_income_tax_after = getIncomeTax(papa_income_tax_after);

	// 所得税増加額
	papa_income_tax = papa_income_tax_after - papa_income_tax_before;
	papa_income_tax = Math.round(papa_income_tax * 10) / 10;

	// 住民税増加額
	papa_resident_tax = getDecreaseSpousalDeduction2() * 0.1;
	papa_resident_tax = Math.round(papa_resident_tax * 10) / 10;

	// 配偶者手当減少額
	papa_allowance = $('#papa_increase_t_3').val();
	papa_value_check_flg3 = $.isNumeric(papa_allowance);
	if(!papa_value_check_flg3) {
		papa_msg += '[配偶者手当減少額]';
	} else {
		papa_allowance = papa_allowance * 12;
	}

	// 保育料その他
	papa_other = $('#papa_increase_t_4').val();
	papa_value_check_flg4 = $.isNumeric(papa_other);
	if(!papa_value_check_flg4) {
		papa_msg += '[その他（保育料 etc）]';
	} else {
		papa_other = papa_other * 12;
	}

	// text の値が数値ではない時の処理
	if(!papa_value_check_flg1 || !papa_value_check_flg2 || !papa_value_check_flg3 || !papa_value_check_flg4) {
		$('#add_attention_2').append('<div class="attention">' + papa_msg + 'は数値を入力してください。</div>');
		papa_flg = false;
	}

	if(papa_flg) {
		if(!papa_input_flg) {
			mom_input_flg = true;
		}

		// slideUp + 修正ボタンを作成
		createFixedButton('papa_increase');

		// Header 部の表示
		totalAddMoney();

		// 詳細表示
		$('#papa_increase_result').slideDown('slow');

		// 修正ボタンからこの処理に入っている場合
		if(fixed_flg) {
			fixed_flg = false;
			allProcss();
		}
	}
}

// 全ての処理を起動
function allProcss() {
	var id_array = ['income', 'social', 'employment', 'mom_increase', 'papa_increase'];

	for(var i = 0; i < id_array.length; i++) {
		for(var j = 0; j < fixed_array.length; j++) {
			if(fixed_array[j] == id_array[i]) {
//				alert('id : ' + id_array[i] + ' fixed : ' + fixed_array[j]);
				if(i == 0) {
					processPartRevenue();
				} else if(i == 1) {
					processSocialInsurance();
				} else if(i == 2) {
					processEmploymentInsurance();
				} else if(i == 3) {
					processMomInsurance();
				} else if(i == 4) {
					processPapaInsurance();
				}
			}
		}

		if(0 == $('#' + id_array[i] + '_sub').size()) {
			$('#' + id_array[i] + '_head').append('<div id="' + id_array[i] + '_sub" class="float_left add_button"><img src="../img/edit.png" style="width: 80%;" /></div><div id="' + id_array[i] + '_sub_cl" class="clear_left"></div>');
			$('#' + id_array[i] + '_head_text').addClass('float_left');
		}
	}
	// 配列の初期化
	fixed_array = [];
}

// slideUp + 修正ボタンを作成
function createFixedButton(id_name) {
	$('#' + id_name + '_slide').slideUp('slow');
	setTimeout(function() {
		if(0 == $('#' + id_name + '_sub').size()) {
			$('#' + id_name + '_head').append('<div id="' + id_name + '_sub" class="float_left add_button"><img src="../img/edit.png" style="width: 80%;" /></div><div id="' + id_name + '_sub_cl" class="clear_left"></div>');
			$('#' + id_name + '_head_text').addClass('float_left');
		}
	}, 600);
}

// slideDown を制御
function nextSlideDown(id_name) {
	// スライドダウン
	$('#' + id_name).slideDown(10);
	$('#' + id_name + '_slide').slideDown('slow');
	$('#' + id_name + '_sub').remove();
	$('#' + id_name + '_sub_cl').remove();
	$('#' + id_name + '_head_text').removeClass('float_left');
}

// 修正ボタンを押した時の処理
$(document).on('click', '.add_button', function() {
	// 修正ボタンフラグを true
	fixed_flg = true;

	// click したボタンの ID を取得
	var click_button_id = this.id;

	// ID の共通の部分を生成
	var common_id = click_button_id.substring(0, click_button_id.length - 4);
	
	clickButton(common_id);
});

// slideDown や slideUp を制御
function clickButton(id) {
	var id_array = ['income', 'social', 'employment', 'mom_increase', 'papa_increase'];

	// slideDown
	nextSlideDown(id);

	// slideUp
	for(var i = 0; i < id_array.length; i++) {
		if(id != id_array[i]) {
			$('#' + id_array[i] + '_slide').slideUp('slow');

			// 他の編集ボタンは押されないように取りあえず削除
			if(0 != $('#' + id_array[i] + '_sub').size()) {
				fixed_array.push(id_array[i]);
			}
			$('#' + id_array[i] + '_sub').remove();
			$('#' + id_array[i] + '_sub_cl').remove();
			$('#' + id_array[i] + '_head_text').removeClass('float_left');
		}
	}

	// 結果を非表示に
	$('#' + id + '_result').slideUp('slow');
}

// 標準報酬を取得
function getStandardRemuneration() {

	var returnValue = 0;

	if(income_value/12 < 6.3) {
		returnValue = 5.8;
	} else if(income_value/12 < 7.3) {
		returnValue = 6.8;
	} else if(income_value/12 < 8.3) {
		returnValue = 7.8;
	} else if(income_value/12 < 9.3) {
		returnValue = 8.8;
	} else if(income_value/12 < 10.1) {
		returnValue = 9.8;
	} else if(income_value/12 < 10.7) {
		returnValue = 10.4;
	} else if(income_value/12 < 11.4) {
		returnValue = 11;
	} else if(income_value/12 < 12.2) {
		returnValue = 11.8;
	} else if(income_value/12 < 13) {
		returnValue = 12.6;
	} else if(income_value/12 < 13.8) {
		returnValue = 13.4;
	} else if(income_value/12 < 14.6) {
		returnValue = 14.2;
	} else if(income_value/12 < 15.5) {
		returnValue = 15;
	} else if(income_value/12 < 16.5) {
		returnValue = 16;
	} else if(income_value/12 < 17.5) {
		returnValue = 17;
	} else if(income_value/12 < 18.5) {
		returnValue = 18;
	} else if(income_value/12 < 19.5) {
		returnValue = 19;
	} else if(income_value/12 < 21) {
		returnValue = 20;
	} else if(income_value/12 < 23) {
		returnValue = 22;
	} else if(income_value/12 < 25) {
		returnValue = 24;
	} else if(income_value/12 < 27) {
		returnValue = 26;
	} else if(income_value/12 < 29) {
		returnValue = 28;
	} else if(income_value/12 < 31) {
		returnValue = 30;
	} else if(income_value/12 < 33) {
		returnValue = 32;
	} else if(income_value/12 < 35) {
		returnValue = 34;
	} else if(income_value/12 < 37) {
		returnValue = 36;
	} else if(income_value/12 < 39.5) {
		returnValue = 38;
	} else if(income_value/12 < 42.5) {
		returnValue = 41;
	} else if(income_value/12 < 45.5) {
		returnValue = 44;
	} else if(income_value/12 < 48.5) {
		returnValue = 47;
	} else if(income_value/12 < 51.5) {
		returnValue = 50;
	} else if(income_value/12 < 54.5) {
		returnValue = 53;
	} else if(income_value/12 < 57.5) {
		returnValue = 56;
	} else if(income_value/12 < 60.5) {
		returnValue = 59;
	} else if(income_value/12 < 63.5) {
		returnValue = 62;
	} else if(income_value/12 < 66.5) {
		returnValue = 65;
	} else if(income_value/12 < 69.5) {
		returnValue = 68;
	} else if(income_value/12 < 73) {
		returnValue = 71;
	} else if(income_value/12 < 77) {
		returnValue = 75;
	} else if(income_value/12 < 81) {
		returnValue = 79;
	} else if(income_value/12 < 85.5) {
		returnValue = 83;
	} else if(income_value/12 < 90.5) {
		returnValue = 88;
	} else if(income_value/12 < 95.5) {
		returnValue = 93;
	} else if(income_value/12 < 100.5) {
		returnValue = 98;
	} else if(income_value/12 < 105.5) {
		returnValue = 103;
	} else if(income_value/12 < 111.5) {
		returnValue = 109;
	} else if(income_value/12 < 117.5) {
		returnValue = 115;
	} else {
		returnValue = 121;
	}

	return returnValue;
}

// 所得税額を計算
function getIncomeTax(income_amount) {
	var returnValue = 0;

	if(income_amount <= 195) {
		returnValue = income_amount * 0.05;
	} else if(income_amount <= 330) {
		returnValue = income_amount * 0.1 - 9.75;
	} else if(income_amount <= 695) {
		returnValue = income_amount * 0.2 - 42.75;
	} else if(income_amount <= 900) {
		returnValue = income_amount * 0.23 - 63.6;
	} else if(income_amount <= 1800) {
		returnValue = income_amount * 0.33 - 153.6;
	} else {
		returnValue = income_amount * 0.4 - 279.6;
	}

	return returnValue;
}

// 減少分の配偶者控除、配偶者特別控除の取得 : 所得税
function getDecreaseSpousalDeduction() {
	var returnValue = 38;
	var deduction = 0;
	var totalIncome = income_value - deduction_salary;

	if(papa_withholding_slip_value1 / 10000 > 1000) {
		if(totalIcome < 38) {
			deduction = 38;
		} else {
			deduction = 0;
		}
	} else {
		if(totalIncome < 40) {
			deduction = 38;
		} else if(totalIncome < 45) {
			deduction = 36;
		} else if(totalIncome < 50) {
			deduction = 31;
		} else if(totalIncome < 55) {
			deduction = 26;
		} else if(totalIncome < 60) {
			deduction = 21;
		} else if(totalIncome < 65) {
			deduction = 16;
		} else if(totalIncome < 70) {
			deduction = 11;
		} else if(totalIncome < 75) {
			deduction = 6;
		} else if(totalIncome < 76) {
			deduction = 3;
		} else {
			deduction = 0;
		}
	}

	returnValue = returnValue - deduction;

	return returnValue;
}

// 減少分の配偶者控除、配偶者特別控除の取得 : 住民税
function getDecreaseSpousalDeduction2() {
	var returnValue = 33;
	var deduction2 = 0;
	var totalIncome = income_value - deduction_salary;

	if(papa_withholding_slip_value1 / 10000 > 1000) {
		if(totalIcome < 38) {
			deduction2 = 33;
		} else {
			deduction2 = 0;
		}
	} else {
		if(totalIncome < 45) {
			deduction2 = 33;
		} else if(totalIncome < 50) {
			deduction2 = 31;
		} else {
			deduction2 = 38 - getDecreaseSpousalDeduction();	// 所得税の方の関数で処理しているので、処理前の値を取得
		}
	}
	
	returnValue = returnValue - deduction2;

	return returnValue;
}

// Header 部の表示
function totalAddMoney() {
	var result_value = 0;

	// Header 部の値を削除
	$('#hincome_nm').remove();		// パート収入
	$('#hsocial_nm').remove();		// 追加負担の合計
	$('#hresult_nm').remove();		// 手取りの増加額

	// 各項目の値を削除
	$('#social_r1_nm').remove();		// 健康保険料
	$('#social_r2_nm').remove();		// 公的年金保険料
	$('#employment_r1_nm').remove();	// 雇用保険料
	$('#mom_increase_r1_nm').remove();	// 所得税増加額（ママ）
	$('#mom_increase_r2_nm').remove();	// 住民税増加額（ママ）
	$('#papa_increase_r1_nm').remove();	// 所得税増加額（パパ）
	$('#papa_increase_r2_nm').remove();	// 住民税増加額（パパ）
	$('#papa_increase_r3_nm').remove();	// 配偶者手当減少額（パパ）
	$('#papa_increase_r4_nm').remove();	// その他（保育料 etc）（パパ）

	totalAmount = 0;
	totalAmount += social_health;
	totalAmount += social_pension;
	totalAmount += employment;
	totalAmount += mom_income_tax;
	totalAmount += mom_resident_tax;
	totalAmount += papa_income_tax;
	totalAmount += papa_resident_tax;
	totalAmount += papa_allowance;
	totalAmount += papa_other;

	// 各項目に結果を表示
	$('#social_result_1').append('<p id="social_r1_nm">' + resultRound(social_health) + '</p>');
	$('#social_result_2').append('<p id="social_r2_nm">' + resultRound(social_pension) + '</p>');
	$('#employment_result_1').append('<p id="employment_r1_nm">' + resultRound(employment) + '</p>');
	$('#mom_increase_result_1').append('<p id="mom_increase_r1_nm">' + resultRound(mom_income_tax) + '</p>');
	$('#mom_increase_result_2').append('<p id="mom_increase_r2_nm">' + resultRound(mom_resident_tax) + '</p>');
	$('#papa_increase_result_1').append('<p id="papa_increase_r1_nm">' + resultRound(papa_income_tax) + '</p>');
	$('#papa_increase_result_2').append('<p id="papa_increase_r2_nm">' + resultRound(papa_resident_tax) + '</p>');
	$('#papa_increase_result_3').append('<p id="papa_increase_r3_nm">' + resultRound(papa_allowance) + '</p>');
	$('#papa_increase_result_4').append('<p id="papa_increase_r4_nm">' + resultRound(papa_other) + '</p>');

	// Header 部に結果を表示
	$('#hincome').append('<b id="hincome_nm">' + resultRound(income_value) + '</b>');
	$('#hsocial').append('<b id="hsocial_nm">' + resultRound(totalAmount) + '</b>');
	$('#hresult').append('<b id="hresult_nm">' + resultRound(income_value - totalAmount) + '</b>');
}

// 小数第2位で表示（小数第3位を四捨五入）
function resultRound(nm) {
	nm = nm * 100;
	nm = Math.round(nm) / 100;

	return nm;
}