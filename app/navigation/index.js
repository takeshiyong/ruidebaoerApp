import React from 'react';
import {
    createStackNavigator,
    createSwitchNavigator,
    createAppContainer,
    createBottomTabNavigator
} from 'react-navigation';
import { Easing, StatusBar, Platform, Animated, Image, Text } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import config from '../config'
import Login from '../page/Login';
import WelcomeScreen from '../page/Welcome';
import HandPhotos from '../page/photograph/handPhoto';
import ScanQRcodes from '../components/scanQRcode';
import Homes from '../page/home';
import MonitoringScreen from '../page/map/monitoring';
import {sH, sW, sT, barHeight, navHeight} from '../utils/screen'
import Mine from '../page/module/mine';
import Organization from '../page/module/organization';
import IndexPage from '../page/module/indexPage';
import Task from '../page/module/task';
import Work from '../page/module/work';
import MessageMain from '../page/message/main';
import MessageDetail from '../page/message/detail';
import PhotographEdits from '../page/photograph/photographEdits';
import Organizes from '../page/organize/index';
import WorkStatus from '../page/module/work/WorkStatus';
import ShopCarts from '../page/integralStore/shopCart';
import ShopMindes from '../page/integralStore/shopMine';
import ShopPages from '../page/integralStore/shopPage';
import AttendanceRecord from '../page/module/work/AttendanceRecord';
import News from '../page/college/news_deatil';
import LiveVideo from '../page/map/liveVideo';
import LiveWeb from '../page/map/LiveWeb';
import Trouble from '../page/module/work/Trouble';
import TroubleIssue from '../page/trouble/TroubleIssue';
import TroubleDetails from '../page/trouble/TroubleDetails';
import TroubleTrack from '../page/trouble/TroubleTrack';
import TroubleQuery from '../page/trouble/TroubleQuery';
import TroubleNotify from '../page/trouble/TroubleNotify';
import TroubleCallBack from '../page/trouble/TroubleCallBack';
import SelectDep from '../page/common/selectDep'
import ProductionManage from '../page/module/work/ProductionManage';
import selectPeopleByDep from '../page/common/selectPeopleByDep';
import selectPeopleByDepMult from '../page/common/selectPeopleByDepMult';
import TroubleJudgment from '../page/trouble/TroubleJudgment';
import TroublePeople from '../page/trouble/TroublePeople';
import ExamineMain from '../page/trouble/TroubleExamine/ExamineMain';
import Environmental from '../page/module/work/Environmental';
import OrganizeList from '../page/organize';
import PeopleDetail from '../page/organize/peopleDetail';


import collegeIndex from '../page/college/index';

import collegeMine from '../page/college/collegeMine';
import collegeCourse from '../page/college/collegeCourse';
import collegeSort from '../page/college/collegeSort';
import Course from '../page/college/Course';
import TroubleList from '../page/trouble/TroubleList';
import TestList from '../page/college/testList';
import TestDetail from '../page/college/testDetail';
import TroubleQueryResult from '../page/trouble/TroubleQueryResult';
import TroubleLog from '../page/trouble/troubleLog';
import TroubleSafeNotify from '../page/trouble/TroubleSafeNotify';
import RectificationResult from '../page/trouble/RectificationResult';
import HandSearch from '../page/photograph/handSearch';
import PowerManagement from '../page/module/work/PowerManagement';
import Verification from '../page/verification/verification';
import Integral from '../page/integralStore/integral';
import RedemptionRecord from '../page/integralStore/redemptionRecord';
import Record from '../page/verification/record';
import Management from '../page/verification/management';
import SuccessRedem from '../page/integralStore/successRedem';
import AddStore from '../page/verification/addStore';
import Confirmation from '../page/verification/confirmation';
import VerificationSuccess from '../page/verification/verificationSuccess';
import Curriculum from '../page/college/curriculum';
import MeetingManage from '../page/conference/meetingManage';
import NewMeeting from '../page/conference/newMeeting';
import ParticipantList from '../page/conference/participantList';
import DeviceManage from '../page/equipment/deviceManage';
import DeviceClass from '../page/equipment/deviceClass';
import DeviceDetail from '../page/equipment/deviceDetail';
import EquipmentList from '../page/equipment/equipmentList';
import CheckItemList from '../page/equipment/checkItemList';
import DeviceParam from '../page/equipment/deviceParam';
import DeviceRecodsMap from '../page/equipment/deviceRecodsMap';
import TempSaveList from '../page/equipment/tempSaveList';
import DeviceRecord from '../page/equipment/deviceRecord';
import DeviceRecordOne from '../page/equipment/deviceRecordOne';
import RecordDetailOne from '../page/equipment/recordDetailOne';
import DeviceMaintain from '../page/equipment/deviceMaintain';
import HistoricalMeeting from '../page/conference/historicalMeeting';
import MeetingSubmission from '../page/conference/meetingSubmission';
import MeetingDetails from '../page/conference/meetingDetails';
import PeopleList from '../page/conference/peopleList/peopleList';
import ReportParticipantList from '../page/conference/reportParticipantList';
import CheckUpManage from '../page/checkUp/manage';
import AddRoute from '../page/checkUp/addRoute';
import CheckUpIngList from '../page/checkUp/checkUpIngList';
import RouteList from '../page/checkUp/routeList';
import RouteDetail from '../page/checkUp/routeDetail';
import SelectDevice from '../page/checkUp/selectDevice';
import CreateCheckUp from '../page/checkUp/createCheckUp';
import RecordDetail from '../page/equipment/recordDetail';
import DevideAdd from '../page/equipment/deviceAdd';
import DevideNextAdd from '../page/equipment/devideNextAdd';
import ManufacturerList from '../page/equipment/manufacturerList';
import MaintainManage  from '../page/maintain/maintainManage';
import MaintainLog from '../page/maintain/maintainLog';
import MaintainAdd from '../page/maintain/maintainAdd';
import AddInfoItem from '../page/maintain/addInfoItem';
import LocationMap from '../components/locationMap';
import CarshopsManage from '../page/carshops/carshopsManage';
import CarshopsAdd from '../page/carshops/carshopsAdd';
import CarshopsTrack from '../page/carshops/carshopsTrack';
import DevicesChoose from '../page/carshops/devicesChoose';
import CarshopsItems from '../page/carshops/carshopsItems';
import CarshopsDetail from '../page/carshops/carshopsDetail';
import DeviceCarshopsDetail from '../page/carshops/deviceCarshopsDetail';
import CarshopsNotis from '../page/carshops/carshopsNotis';
import ShelfStore from '../page/verification/shelfStore';
import ShelfList from '../page/verification/shelfList';
import MorePlane from '../page/carshops/morePlane';
import GetInterDetail from '../page/integralStore/getInterDetail';
import BylawItems from '../page/organization/bylawItems';
import SafeMange from '../page/organization/safeMange';
import Responsibility from '../page/organization/responsibility';
import showDownModal from '../page/organization/showDonwModal';
import ResponsibilityDetail from '../page/organization/responsibilityDetail';
import ShowPeople from '../components/showPeople';
import MainCarshopsDetail from '../page/carshops/mainCarshopsDetail';
import MaterialIdentificationManage from '../page/MaterialIdentification/manage';
import DevicesCamera from '../page/MaterialIdentification/devicesCamera';
import CameraDetail from '../page/MaterialIdentification/cameraDetail';
import AlarmRecord from '../page/MaterialIdentification/alarmRecord';
import ItemDetail from '../page/MaterialIdentification/itemDetail';
import TestTips from '../page/college/testTips';
import VideoSurveillanceMange from '../page/videoSurveillance/manage';
import MoreCameraList from '../page/videoSurveillance/moreCameraList.js';
import VideoFirstList from '../page/videoSurveillance/firstList.js';
import VideoSecondList from '../page/videoSurveillance/secondList.js';
import CultivateManage from '../page/cultivate/manage';
import AddCultivate from '../page/cultivate/addcultivate';
import CulVideoChoose from '../page/cultivate/culVideoChoose';
import CultivateReport from '../page/cultivate/cultivateReport';
import CultivateDetail from '../page/cultivate/cultivateDetail';
import MoreList from '../page/college/moreList';
import DeviceDoc from '../page/equipment/DeviceDoc';
import ShowFileItem from '../page/equipment/showFileItem';

const isAndroid = Platform.OS === 'android';
const navStyle = navHeight();
const stackOption = {
    // 自定义Stack路由切换动画
    mode: 'modal',
    transitionConfig: () => ({
        transitionSpec: {
            duration: 500,
            easing: Easing.out(Easing.poly(4)),
            timing: Animated.timing,
        },
        screenInterpolator: sceneProps => {
            const { layout, position, scene } = sceneProps;
            const { index } = scene;

            const height = layout.initHeight;
            // translateX-横向切换   translateY-纵向切换
            const translateX = position.interpolate({
                inputRange: [index - 1, index, index + 1],
                outputRange: [height, 0, 0],
            });

            const opacity = position.interpolate({
                inputRange: [index - 1, index - 0.99, index],
                outputRange: [0, 1, 1],
            });

            return { opacity, transform: [{ translateX }] };
        },
    }),
    // 默认配置
    defaultNavigationOptions: ({ navigation }) => ({
        headerStyle: {
            backgroundColor: config.mainColor,
            paddingTop: isAndroid ? StatusBar.currentHeight : navStyle.paddingTop,
            borderTopWidth: sT(2),
            height: navStyle.height
        },
        headerTintColor: config.otherColor,
        headerBackTitle: null
    }),
}

// 企业
const OrganizationStack = createStackNavigator({
    Organization: { screen: Organization }
}, { ...stackOption });

// 首页
const IndexPageStack = createStackNavigator({
    IndexPage: { screen: IndexPage }
}, { ...stackOption });

// 工作
const WorkStack = createStackNavigator({
    Work: { screen: Work }
}, { ...stackOption });

// 任务
const TaskStack = createStackNavigator({
    Task: { screen: Task },
}, { ...stackOption });

// 我的
const MineStack = createStackNavigator({
    Mine: { screen: Mine },
}, { ...stackOption });
//商城我的
const ShopMineStack = createStackNavigator({
    ShopMindes: { screen: ShopMindes },
}, { ...stackOption });
//商城首页
const ShopPageStack = createStackNavigator({
    ShopPages: { screen: ShopPages },
}, { ...stackOption });
//商城购物车
const ShopCartStack = createStackNavigator({
    ShopCarts: { screen: ShopCarts },
}, { ...stackOption });
//学院首页
const CollegeIndexs = createStackNavigator({
    collegeIndex: { screen: collegeIndex },
}, { ...stackOption });
//学院分类
const CollegeSorts = createStackNavigator({
    collegeSort: { screen: collegeSort },
}, { ...stackOption });
//学院资源
const CollegeCourses = createStackNavigator({
    collegeCourse: { screen: collegeCourse },
}, { ...stackOption });
//学院我的
const CollegeMines = createStackNavigator({
    collegeMine: { screen: collegeMine },
}, { ...stackOption });

// 底部导航
const TabNavigator = createBottomTabNavigator(
    {
        'Index': IndexPageStack,
        'Task': TaskStack,
        'Work': WorkStack,
        'Organization': OrganizationStack,
        'Mine': MineStack,
    },
    {
        headerMode: 'none',
        initialRouteName: 'Index', // 设置默认的页面
        lazy: true, // 是否在app打开的时候将底部标签栏全部加载
        backBehavior: null, // 点击返回退到上级界面
        safeAreaInset: {    //适应异形屏
            top: 'always',
            bottom: 'always',
            left: 'always',
            right: 'always'
        },
        navigationOptions: () => ({
            header: null,
            headerBackTitle: null
        }),
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarLabel: ({ focused, tintColor }) => {
                const { routeName } = navigation.state
                switch (routeName) {
                    case 'Index':
                        return <Text style={{ color: tintColor, fontSize: 12, textAlign: 'center' ,marginTop: -10}}>首页</Text>
                    case 'Organization':
                        return <Text style={{ color: tintColor, fontSize: 12, textAlign: 'center' ,marginTop: -10}}>企业</Text>
                    case 'Work':
                        return <Text style={{ color: tintColor, fontSize: 12, textAlign: 'center' ,marginTop: -10}}>工作</Text>
                    case 'Task':
                        return <Text style={{ color: tintColor, fontSize: 12, textAlign: 'center' ,marginTop: -10}}>任务</Text>
                    case 'Mine':
                        return <Text style={{ color: tintColor, fontSize: 12, textAlign: 'center' ,marginTop: -10}}>我的</Text>
                }
            },
            tabBarIcon: ({ focused, horizontal, tintColor }) => {
                const { routeName } = navigation.state;
                let iconName;
                switch (routeName) {
                    case 'Index':
                        iconName = focused ? require('../image/button/focused/home.png') : require('../image/button/unfocused/home.png')
                        break;
                    case 'Organization':
                        iconName = focused ? require('../image/button/focused/Organization.png') : require('../image/button/unfocused/Organization.png')
                        break;
                    case 'Work':
                        iconName = focused ? require('../image/button/focused/Work.png') : require('../image/button/unfocused/Work.png')
                        break;
                    case 'Task':
                        iconName = focused ? require('../image/button/focused/task.png') : require('../image/button/unfocused/task.png')
                        break;
                    case 'Mine':
                        iconName = focused ? require('../image/button/focused/mine.png') : require('../image/button/unfocused/mine.png')
                        break;
                    default:
                        return null
                        break;
                }
                return <Image source={iconName} resizeMode='stretch' style={{ width: 25, height: 25 }} />
            },
        }),
        tabBarOptions: {
            activeTintColor: config.otherColor,
            inactiveTintColor: 'gray',
            labelStyle: {
                fontSize: 12,
            },
            style: {
                backgroundColor: config.mainColor,
            },
        },
    }
)

//商城底部导航
const ShopTabNavigator = createBottomTabNavigator(
    {
        'ShopPage': ShopPageStack,
        'ShopCart': ShopCartStack,
    },
    {
        headerMode: 'none',
        initialRouteName: 'ShopPage', // 设置默认的页面
        lazy: true, // 是否在app打开的时候将底部标签栏全部加载
        backBehavior: null, // 点击返回退到上级界面
        safeAreaInset: {    //适应异形屏
            top: 'always',
            bottom: 'always',
            left: 'always',
            right: 'always'
        },
        navigationOptions: () => ({
            header: null,
            headerBackTitle: null
        }),
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarLabel: ({ focused, tintColor }) => {
                const { routeName } = navigation.state
                switch (routeName) {
                    case 'ShopPage':
                        return <Text style={{ color: tintColor, fontSize: 12, textAlign: 'center' }}>首页</Text>
                    case 'ShopCart':
                        return <Text style={{ color: tintColor, fontSize: 12, textAlign: 'center' }}>订单</Text>
                    
                }
            },
            tabBarIcon: ({ focused, horizontal, tintColor }) => {
                const { routeName } = navigation.state;
                let iconName;
                switch (routeName) {
                    case 'ShopPage':
                        iconName = focused ? require('../image/integarlStore/hoFocused.png') : require('../image/integarlStore/hoUnFocused.png')
                        break;
                    case 'ShopCart':
                        iconName = focused ? require('../image/integarlStore/baFocused.png') : require('../image/integarlStore/baUnFocused.png')
                        break;
                    default:
                        return null
                        break;
                }
                return <Image source={iconName} resizeMode='stretch' style={{ width: 25, height: 25 }} />
            },
        }),
        tabBarOptions: {
            activeTintColor: config.otherColor,
            inactiveTintColor: 'gray',
            labelStyle: {
                fontSize: 12,
            },
            style: {
                backgroundColor: config.mainColor,
            },
        },
    }
)
//学院底部导航
const CollegeTabNavigator = createBottomTabNavigator(
    {
        'collegeIndex': CollegeIndexs,
        'collegeSort': CollegeSorts,
        'collegeCourse': CollegeCourses,
        'collegeMine': CollegeMines,
    },
    {
        headerMode: 'none',
        initialRouteName: 'collegeIndex', // 设置默认的页面
        lazy: true, // 是否在app打开的时候将底部标签栏全部加载
        backBehavior: null, // 点击返回退到上级界面
        safeAreaInset: {    //适应异形屏
            top: 'always',
            bottom: 'always',
            left: 'always',
            right: 'always'
        },
        navigationOptions: () => ({
            header: null,
            headerBackTitle: null
        }),
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarLabel: ({ focused, tintColor }) => {
                const { routeName } = navigation.state
                switch (routeName) {
                    case 'collegeIndex':
                        return <Text style={{ color: tintColor, fontSize: 12, textAlign: 'center' }}>首页</Text>
                    case 'collegeSort':
                        return <Text style={{ color: tintColor, fontSize: 12, textAlign: 'center' }}>分类</Text>
                    case 'collegeCourse':
                        return <Text style={{ color: tintColor, fontSize: 12, textAlign: 'center' }}>课程表</Text>
                    case 'collegeMine':
                        return <Text style={{ color: tintColor, fontSize: 12, textAlign: 'center' }}>我的</Text>
                }
            },
            tabBarIcon: ({ focused, horizontal, tintColor }) => {
                const { routeName } = navigation.state;
                let iconName;
                switch (routeName) {
                    case 'collegeIndex':
                        iconName = focused ? require('../image/button/cofocused/index.png') : require('../image/button/counfocused/index.png')
                        break;
                    case 'collegeSort':
                        iconName = focused ? require('../image/button/cofocused/sort.png') : require('../image/button/counfocused/sort.png')
                        break;
                    case 'collegeCourse':
                        iconName = focused ? require('../image/button/cofocused/course.png') : require('../image/button/counfocused/course.png')
                        break;
                    case 'collegeMine':
                        iconName = focused ? require('../image/button/cofocused/mine.png') : require('../image/button/counfocused/mine.png')
                        break;
                    default:
                        return null
                        break;
                }
                return <Image source={iconName} resizeMode='stretch' style={{ width: 25, height: 25 }} />
            },
        }),
        tabBarOptions: {
            activeTintColor: config.otherColor,
            inactiveTintColor: 'gray',
            labelStyle: {
                fontSize: 12,
            },
            style: {
                backgroundColor: config.mainColor,
            },
        },
    }
)

const AppStack = createStackNavigator({
    Tabs:    TabNavigator,
    Welcome: { screen: WelcomeScreen },
    Login:   {screen: Login},
    Map:     {screen: MonitoringScreen},
    PhotographEdit: {screen: PhotographEdits},
    Organize: {screen: Organizes},
    HandPhoto: {screen: HandPhotos},
    ScanQRcode: {screen: ScanQRcodes},
    Message: {screen: MessageMain},
    ShopTabNavigator: ShopTabNavigator,
    WorkStatus: {screen: WorkStatus},
    AttendanceRecord: {screen: AttendanceRecord},
    News: {screen: News},
    Trouble: {screen: Trouble},
	Live: {screen: LiveVideo},
    LiveWeb: {screen: LiveWeb},
    TroubleIssue: {screen: TroubleIssue},
    TroubleDetails: {screen: TroubleDetails},
    TroubleTrack: {screen: TroubleTrack},
    TroubleQuery: {screen: TroubleQuery},
    TroubleNotify: {screen: TroubleNotify},
    TroubleCallBack: {screen: TroubleCallBack},
    ProductionManage: {screen: ProductionManage},
	SelectDep: {screen: SelectDep},
    selectPeopleByDep: {screen: selectPeopleByDep},
    selectPeopleByDepMult: {screen: selectPeopleByDepMult},
    TroubleJudgment: {screen: TroubleJudgment},
    ExamineMain: {screen: ExamineMain},
    TroubleSafeNotify: {screen: TroubleSafeNotify},
    Environmental: {screen: Environmental},
 	TroubleList: {screen: TroubleList},
    TroubleQueryResult: {screen: TroubleQueryResult},
    CollegeTabNavigator: {screen: CollegeTabNavigator},
    Course: {screen: Course},
    TroubleLog: {screen: TroubleLog},
    RectificationResult: {screen: RectificationResult},
    HandSearch: {screen: HandSearch},
    PowerManagement: {screen: PowerManagement},
	TroublePeople: {screen: TroublePeople},
    MessageDetail: {screen: MessageDetail},
    Verification: {screen: Verification},
    Integral: {screen: Integral},
    RedemptionRecord: {screen: RedemptionRecord},
    Record: {screen: Record},
    Management: {screen: Management},
    SuccessRedem: {screen: SuccessRedem},
    AddStore: {screen: AddStore},
    Confirmation: {screen: Confirmation},
    VerificationSuccess: {screen: VerificationSuccess},
    Curriculum: {screen: Curriculum},
    MeetingManage: {screen: MeetingManage},
    NewMeeting: {screen: NewMeeting},
    ParticipantList: {screen: ParticipantList},
    DeviceManage: {screen: DeviceManage},
    DeviceClass: {screen: DeviceClass},
    DeviceDetail: {screen: DeviceDetail},
    DeviceRecodsMap: {screen: DeviceRecodsMap},
    DeviceRecord: {screen: DeviceRecord},
    DeviceMaintain: {screen: DeviceMaintain},
	HistoricalMeeting: {screen: HistoricalMeeting},
    MeetingSubmission: {screen: MeetingSubmission},
    CheckUpIngList: {screen: CheckUpIngList},
    MeetingDetails: {screen: MeetingDetails},
    PeopleList: {screen: PeopleList},
    ReportParticipantList: {screen: ReportParticipantList},
    OrganizeList: {screen: OrganizeList},
    PeopleDetail: {screen: PeopleDetail},
    DeviceParam: {screen: DeviceParam},
    CheckUpManage: {screen: CheckUpManage},
	RecordDetail: {screen: RecordDetail},
	AddRoute: {screen: AddRoute},
    DevideNextAdd: {screen: DevideNextAdd},
    ManufacturerList: {screen: ManufacturerList},
    SelectDevice: {screen: SelectDevice},
    RouteList: {screen: RouteList},
    RouteDetail: {screen: RouteDetail},
    CreateCheckUp: {screen: CreateCheckUp},
	DevideAdd: {screen: DevideAdd},
    MaintainManage: {screen: MaintainManage},
    MaintainLog: {screen: MaintainLog},
    MaintainAdd: {screen: MaintainAdd},
    AddInfoItem: {screen: AddInfoItem},
    LocationMap: {screen: LocationMap},
    CarshopsManage: {screen: CarshopsManage},
    CarshopsAdd: {screen: CarshopsAdd},
    CarshopsTrack: {screen: CarshopsTrack},
    DevicesChoose: {screen: DevicesChoose},
    CarshopsItems: {screen: CarshopsItems},
    CarshopsDetail: {screen: CarshopsDetail},
    DeviceCarshopsDetail: {screen: DeviceCarshopsDetail},
    CarshopsNotis: {screen: CarshopsNotis},
    TempSaveList: {screen: TempSaveList},
    TestList: {screen: TestList},
    TestDetail: {screen: TestDetail},
    ShelfStore: {screen: ShelfStore},
    ShelfList: {screen: ShelfList},
    MorePlane: {screen: MorePlane},
    GetInterDetail: {screen: GetInterDetail},
    DeviceRecordOne: {screen: DeviceRecordOne},
    BylawItems: {screen: BylawItems},
    SafeMange: {screen: SafeMange},
    Responsibility: {screen: Responsibility},
    ResponsibilityDetail: {screen: ResponsibilityDetail},
	EquipmentList: {screen: EquipmentList},
    CheckItemList: {screen: CheckItemList},
    MainCarshopsDetail: {screen: MainCarshopsDetail},
    ShowPeople: {screen: ShowPeople},
    showDownModal: {screen: showDownModal},
    MaterialIdentificationManage: {screen: MaterialIdentificationManage},
    DevicesCamera: {screen: DevicesCamera},
    CameraDetail: {screen: CameraDetail},
    AlarmRecord: {screen: AlarmRecord},
    ItemDetail: {screen: ItemDetail},
    TestTips: {screen: TestTips},
    VideoSurveillanceMange: {screen: VideoSurveillanceMange},
    MoreCameraList: {screen: MoreCameraList},
    VideoFirstList: {screen: VideoFirstList},
    VideoSecondList: {screen: VideoSecondList},
    RecordDetailOne: {screen: RecordDetailOne},
    CultivateManage: {screen: CultivateManage},
    AddCultivate: {screen: AddCultivate},
    CulVideoChoose: {screen: CulVideoChoose},
    CultivateReport: {screen: CultivateReport},
    CultivateDetail: {screen: CultivateDetail},
    MoreList: {screen: MoreList},
    DeviceDoc: {screen: DeviceDoc},
    ShowFileItem: {screen: ShowFileItem}
}, {
    initialRouteName: 'Welcome', // 设置默认的页面
    ...stackOption
});

export default createAppContainer(AppStack);
