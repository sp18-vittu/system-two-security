import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import { DataGrid, GridColDef, GridSelectionModel } from '@mui/x-data-grid'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { repositoryDocList } from '../../redux/nodes/repository/action'
import local from '../../utils/local'
import { getAddSourceId } from '../../redux/nodes/chat/action'
import useWindowResolution from '../../layouts/Dashboard/useWindowResolution'

export default function Crmmarketing() {
  const repositoryDoclists = useSelector((state: any) => state.repositoryDocreducer)
  const { RepositoryDocList, loading, error } = repositoryDoclists

  const { state } = useLocation()
  const location = useLocation()
  const dispatch = useDispatch()
  const { height } = useWindowResolution()

  const [CrmMarketing, setCrmMarketing] = useState([] as any)
  const NewtestValue: any = []
  const localToken = local.getItem('bearerToken')
  const token = JSON.parse(localToken as any)
  let [id, name, crmid] = location.pathname.split('/')

  let selectCheckbox: any
  let get_id: any = []
  let getelect: any = JSON.parse(sessionStorage.getItem('sessionVault') || '[]')
  selectCheckbox = getelect?.find((x: any) => x.id == (crmid ? crmid : name))

  const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>()
  useEffect(() => {
    if (selectCheckbox?.documents?.length > 0) {
      setSelectionModel(() => selectCheckbox?.documents.map((r: any) => r.id))
    }

    setCrmMarketing(RepositoryDocList)
    dispatch(getAddSourceId(token, id) as any)
  }, [repositoryDoclists])

  const CustomNoRowsOverlay = () => {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#FFF',
          backgroundColor: '#0C111D',
          padding: '16px',
          textAlign: 'center',
          height: '340px',
        }}
      >
        <div>No rows</div>
      </div>
    )
  }

  useEffect(() => {
    {
      location.pathname === `/app/selectsource/Crmmarketing/${name}`
        ? dispatch(repositoryDocList(token, name) as any)
        : dispatch(repositoryDocList(token, crmid) as any)
    }
  }, [dispatch])
  let statevariable: any = false
  for (let i = 0; i < state.length; i++) {
    if (state[i]) {
      statevariable = state[i]
    }
  }

  let defaultSelected: any = []
  let chekboxSelected: any = []
  let variable: any = false
  const [totalSelectedCheckboxes, setTotalSelectedCheckboxes] = useState([])
  chekboxSelected = [...totalSelectedCheckboxes]
  for (let i = 0; i < chekboxSelected.length; i++) {
    if (chekboxSelected.length > 0) {
      variable = true
      defaultSelected.push(chekboxSelected[i]?.id)
    }
  }

  const [message, setMessage] = useState([])

  const navigateTo = useNavigate()

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Resources',
      flex: 1,
      minWidth: 250,
      sortable: false,
      filterable: false,
      headerClassName: 'hideRightSeparator',
      renderCell: (params: any) => {
        var totalSizeKB = params.row.documentSize / Math.pow(1024, 1)
        return (
          <>
            {params?.row?.type === 'PDF' ? (
              <svg
                width='25'
                height='25'
                viewBox='0 0 40 40'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M7.75 4C7.75 2.20508 9.20508 0.75 11 0.75H27C27.1212 0.75 27.2375 0.798159 27.3232 0.883885L38.1161 11.6768C38.2018 11.7625 38.25 11.8788 38.25 12V36C38.25 37.7949 36.7949 39.25 35 39.25H11C9.20507 39.25 7.75 37.7949 7.75 36V4Z'
                  fill='white'
                  stroke='#D0D5DD'
                  strokeWidth='1.5'
                />
                <path
                  d='M27 0.5V8C27 10.2091 28.7909 12 31 12H38.5'
                  stroke='#D0D5DD'
                  strokeWidth='1.5'
                />
                <rect x='1' y='18' width='26' height='16' rx='2' fill='#D92D20' />
                <path
                  d='M4.8323 30V22.7273H7.70162C8.25323 22.7273 8.72316 22.8326 9.11142 23.0433C9.49967 23.2517 9.7956 23.5417 9.9992 23.9134C10.2052 24.2827 10.3082 24.7088 10.3082 25.1918C10.3082 25.6747 10.204 26.1009 9.99565 26.4702C9.78732 26.8395 9.48547 27.1271 9.09011 27.3331C8.69712 27.5391 8.22127 27.642 7.66255 27.642H5.83372V26.4098H7.41397C7.7099 26.4098 7.95375 26.3589 8.14551 26.2571C8.33964 26.1529 8.48405 26.0097 8.57875 25.8274C8.67581 25.6428 8.72434 25.4309 8.72434 25.1918C8.72434 24.9503 8.67581 24.7396 8.57875 24.5597C8.48405 24.3774 8.33964 24.2365 8.14551 24.1371C7.95138 24.0353 7.70517 23.9844 7.40687 23.9844H6.36994V30H4.8323ZM13.885 30H11.3069V22.7273H13.9063C14.6379 22.7273 15.2676 22.8729 15.7955 23.1641C16.3235 23.4529 16.7295 23.8684 17.0136 24.4105C17.3 24.9527 17.4433 25.6013 17.4433 26.3565C17.4433 27.1141 17.3 27.7652 17.0136 28.3097C16.7295 28.8542 16.3211 29.272 15.7884 29.5632C15.2581 29.8544 14.6237 30 13.885 30ZM12.8445 28.6825H13.8211C14.2757 28.6825 14.658 28.602 14.9681 28.4411C15.2806 28.2777 15.515 28.0256 15.6713 27.6847C15.8299 27.3414 15.9092 26.8987 15.9092 26.3565C15.9092 25.8191 15.8299 25.38 15.6713 25.0391C15.515 24.6982 15.2818 24.4472 14.9717 24.2862C14.6615 24.1252 14.2792 24.0447 13.8247 24.0447H12.8445V28.6825ZM18.5823 30V22.7273H23.3976V23.995H20.1199V25.728H23.078V26.9957H20.1199V30H18.5823Z'
                  fill='white'
                />
              </svg>
            ) : params?.row?.type === 'JSON' ? (
              <svg
                width='25'
                height='25'
                viewBox='0 0 40 40'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M7.75 4C7.75 2.20508 9.20508 0.75 11 0.75H27C27.1212 0.75 27.2375 0.798159 27.3232 0.883885L38.1161 11.6768C38.2018 11.7625 38.25 11.8788 38.25 12V36C38.25 37.7949 36.7949 39.25 35 39.25H11C9.20507 39.25 7.75 37.7949 7.75 36V4Z'
                  fill='white'
                  stroke='#D0D5DD'
                  strokeWidth='1.5'
                />
                <path
                  d='M27 0.5V8C27 10.2091 28.7909 12 31 12H38.5'
                  stroke='#D0D5DD'
                  strokeWidth='1.5'
                />
                <rect x='1' y='18' width='34' height='16' rx='2' fill='#444CE7' />
                <path
                  d='M7.82821 22.7273H9.3481V27.7983C9.3481 28.267 9.24275 28.6742 9.03205 29.0199C8.82372 29.3655 8.53371 29.6319 8.16202 29.8189C7.79033 30.0059 7.35828 30.0994 6.86586 30.0994C6.42788 30.0994 6.03016 30.0225 5.67267 29.8686C5.31756 29.7124 5.03584 29.4756 4.8275 29.1584C4.61917 28.8388 4.51619 28.4375 4.51855 27.9545H6.04909C6.05383 28.1463 6.09289 28.3108 6.16628 28.4482C6.24204 28.5831 6.34502 28.6873 6.47523 28.7607C6.60781 28.8317 6.76406 28.8672 6.94398 28.8672C7.13337 28.8672 7.29318 28.8269 7.42338 28.7464C7.55596 28.6636 7.65658 28.5429 7.72523 28.3842C7.79389 28.2256 7.82821 28.0303 7.82821 27.7983V22.7273ZM14.5647 24.8189C14.5363 24.5324 14.4144 24.3099 14.199 24.1513C13.9835 23.9927 13.6911 23.9134 13.3218 23.9134C13.0709 23.9134 12.859 23.9489 12.6862 24.0199C12.5133 24.0885 12.3808 24.1844 12.2884 24.3075C12.1985 24.4306 12.1535 24.5703 12.1535 24.7266C12.1488 24.8568 12.176 24.9704 12.2352 25.0675C12.2967 25.1645 12.3808 25.2486 12.4873 25.3196C12.5938 25.3883 12.7169 25.4486 12.8566 25.5007C12.9963 25.5504 13.1454 25.593 13.3041 25.6286L13.9575 25.7848C14.2747 25.8558 14.5659 25.9505 14.8311 26.0689C15.0962 26.1873 15.3258 26.3329 15.52 26.5057C15.7141 26.6785 15.8644 26.8821 15.971 27.1165C16.0799 27.3509 16.1355 27.6196 16.1379 27.9226C16.1355 28.3677 16.0219 28.7536 15.797 29.0803C15.5744 29.4046 15.2525 29.6567 14.8311 29.8366C14.412 30.0142 13.9066 30.103 13.3147 30.103C12.7276 30.103 12.2162 30.013 11.7806 29.8331C11.3474 29.6532 11.0088 29.3868 10.765 29.0341C10.5235 28.679 10.3969 28.2398 10.385 27.7166H11.873C11.8895 27.9605 11.9594 28.1641 12.0825 28.3274C12.2079 28.4884 12.3749 28.6103 12.5832 28.6932C12.7939 28.7737 13.0318 28.8139 13.297 28.8139C13.5574 28.8139 13.7835 28.776 13.9752 28.7003C14.1694 28.6245 14.3197 28.5192 14.4262 28.3842C14.5328 28.2493 14.586 28.0942 14.586 27.919C14.586 27.7557 14.5375 27.6184 14.4404 27.5071C14.3457 27.3958 14.2061 27.3011 14.0214 27.223C13.8391 27.1449 13.6154 27.0739 13.3502 27.0099L12.5583 26.8111C11.9452 26.6619 11.461 26.4287 11.1059 26.1115C10.7508 25.7943 10.5744 25.367 10.5768 24.8295C10.5744 24.3892 10.6916 24.0045 10.9284 23.6754C11.1675 23.3464 11.4954 23.0895 11.912 22.9048C12.3287 22.7202 12.8022 22.6278 13.3325 22.6278C13.8722 22.6278 14.3434 22.7202 14.7458 22.9048C15.1507 23.0895 15.4655 23.3464 15.6904 23.6754C15.9153 24.0045 16.0313 24.3857 16.0384 24.8189H14.5647ZM23.8554 26.3636C23.8554 27.1567 23.705 27.8314 23.4044 28.3878C23.1061 28.9441 22.6989 29.3691 22.1828 29.6626C21.6691 29.9538 21.0914 30.0994 20.4498 30.0994C19.8035 30.0994 19.2235 29.9527 18.7098 29.6591C18.1961 29.3655 17.79 28.9406 17.4917 28.3842C17.1934 27.8279 17.0443 27.1544 17.0443 26.3636C17.0443 25.5705 17.1934 24.8958 17.4917 24.3395C17.79 23.7831 18.1961 23.3594 18.7098 23.0682C19.2235 22.7746 19.8035 22.6278 20.4498 22.6278C21.0914 22.6278 21.6691 22.7746 22.1828 23.0682C22.6989 23.3594 23.1061 23.7831 23.4044 24.3395C23.705 24.8958 23.8554 25.5705 23.8554 26.3636ZM22.2964 26.3636C22.2964 25.8499 22.2195 25.4167 22.0656 25.0639C21.9141 24.7112 21.6998 24.4437 21.4229 24.2614C21.1459 24.0791 20.8215 23.9879 20.4498 23.9879C20.0782 23.9879 19.7538 24.0791 19.4768 24.2614C19.1998 24.4437 18.9844 24.7112 18.8305 25.0639C18.679 25.4167 18.6032 25.8499 18.6032 26.3636C18.6032 26.8774 18.679 27.3106 18.8305 27.6634C18.9844 28.0161 19.1998 28.2836 19.4768 28.4659C19.7538 28.6482 20.0782 28.7393 20.4498 28.7393C20.8215 28.7393 21.1459 28.6482 21.4229 28.4659C21.6998 28.2836 21.9141 28.0161 22.0656 27.6634C22.2195 27.3106 22.2964 26.8774 22.2964 26.3636ZM31.0775 22.7273V30H29.7494L26.5853 25.4226H26.532V30H24.9944V22.7273H26.3438L29.483 27.3011H29.547V22.7273H31.0775Z'
                  fill='white'
                />
              </svg>
            ) : params?.row?.type === 'HTML' ? (
              <svg
                width='25'
                height='25'
                viewBox='0 0 40 40'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M7.75 4C7.75 2.20508 9.20508 0.75 11 0.75H27C27.1212 0.75 27.2375 0.798159 27.3232 0.883885L38.1161 11.6768C38.2018 11.7625 38.25 11.8788 38.25 12V36C38.25 37.7949 36.7949 39.25 35 39.25H11C9.20507 39.25 7.75 37.7949 7.75 36V4Z'
                  fill='white'
                  stroke='#D0D5DD'
                  strokeWidth='1.5'
                />
                <path
                  d='M27 0.5V8C27 10.2091 28.7909 12 31 12H38.5'
                  stroke='#D0D5DD'
                  strokeWidth='1.5'
                />
                <rect x='1' y='18' width='35' height='16' rx='2' fill='#444CE7' />
                <path
                  d='M4.64968 30V22.7273H6.18732V25.728H9.30877V22.7273H10.8429V30H9.30877V26.9957H6.18732V30H4.64968ZM11.8336 23.995V22.7273H17.8066V23.995H15.5801V30H14.0602V23.995H11.8336ZM18.7903 22.7273H20.6866L22.6895 27.6136H22.7747L24.7775 22.7273H26.6738V30H25.1824V25.2663H25.122L23.2399 29.9645H22.2243L20.3422 25.2486H20.2818V30H18.7903V22.7273ZM27.9407 30V22.7273H29.4783V28.7322H32.5962V30H27.9407Z'
                  fill='white'
                />
              </svg>
            ) : params?.row?.type === 'DOC' || params?.row?.type === 'DOCX' ? (
              <svg
                width='25'
                height='25'
                viewBox='0 0 40 40'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M7.75 4C7.75 2.20508 9.20508 0.75 11 0.75H27C27.1212 0.75 27.2375 0.798159 27.3232 0.883885L38.1161 11.6768C38.2018 11.7625 38.25 11.8788 38.25 12V36C38.25 37.7949 36.7949 39.25 35 39.25H11C9.20507 39.25 7.75 37.7949 7.75 36V4Z'
                  fill='white'
                  stroke='#D0D5DD'
                  strokeWidth='1.5'
                />
                <path
                  d='M27 0.5V8C27 10.2091 28.7909 12 31 12H38.5'
                  stroke='#D0D5DD'
                  strokeWidth='1.5'
                />
                <rect x='1' y='18' width='29' height='16' rx='2' fill='#155EEF' />
                <path
                  d='M7.40163 30H4.82351V22.7273H7.42294C8.15447 22.7273 8.78421 22.8729 9.31214 23.1641C9.84008 23.4529 10.2461 23.8684 10.5302 24.4105C10.8166 24.9527 10.9599 25.6013 10.9599 26.3565C10.9599 27.1141 10.8166 27.7652 10.5302 28.3097C10.2461 28.8542 9.83771 29.272 9.30504 29.5632C8.77474 29.8544 8.14027 30 7.40163 30ZM6.36115 28.6825H7.33771C7.79226 28.6825 8.1746 28.602 8.48473 28.4411C8.79723 28.2777 9.03161 28.0256 9.18786 27.6847C9.34647 27.3414 9.42578 26.8987 9.42578 26.3565C9.42578 25.8191 9.34647 25.38 9.18786 25.0391C9.03161 24.6982 8.79841 24.4472 8.48828 24.2862C8.17815 24.1252 7.79581 24.0447 7.34126 24.0447H6.36115V28.6825ZM18.7821 26.3636C18.7821 27.1567 18.6318 27.8314 18.3311 28.3878C18.0328 28.9441 17.6257 29.3691 17.1096 29.6626C16.5958 29.9538 16.0182 30.0994 15.3766 30.0994C14.7303 30.0994 14.1503 29.9527 13.6365 29.6591C13.1228 29.3655 12.7168 28.9406 12.4185 28.3842C12.1202 27.8279 11.9711 27.1544 11.9711 26.3636C11.9711 25.5705 12.1202 24.8958 12.4185 24.3395C12.7168 23.7831 13.1228 23.3594 13.6365 23.0682C14.1503 22.7746 14.7303 22.6278 15.3766 22.6278C16.0182 22.6278 16.5958 22.7746 17.1096 23.0682C17.6257 23.3594 18.0328 23.7831 18.3311 24.3395C18.6318 24.8958 18.7821 25.5705 18.7821 26.3636ZM17.2232 26.3636C17.2232 25.8499 17.1462 25.4167 16.9924 25.0639C16.8408 24.7112 16.6266 24.4437 16.3496 24.2614C16.0726 24.0791 15.7483 23.9879 15.3766 23.9879C15.0049 23.9879 14.6806 24.0791 14.4036 24.2614C14.1266 24.4437 13.9112 24.7112 13.7573 25.0639C13.6058 25.4167 13.53 25.8499 13.53 26.3636C13.53 26.8774 13.6058 27.3106 13.7573 27.6634C13.9112 28.0161 14.1266 28.2836 14.4036 28.4659C14.6806 28.6482 15.0049 28.7393 15.3766 28.7393C15.7483 28.7393 16.0726 28.6482 16.3496 28.4659C16.6266 28.2836 16.8408 28.0161 16.9924 27.6634C17.1462 27.3106 17.2232 26.8774 17.2232 26.3636ZM26.3381 25.2734H24.7827C24.7543 25.0722 24.6963 24.8935 24.6087 24.7372C24.5211 24.5786 24.4086 24.4437 24.2713 24.3324C24.134 24.2211 23.9754 24.1359 23.7955 24.0767C23.6179 24.0175 23.425 23.9879 23.2166 23.9879C22.8402 23.9879 22.5123 24.0814 22.233 24.2685C21.9536 24.4531 21.737 24.723 21.5831 25.0781C21.4292 25.4309 21.3523 25.8594 21.3523 26.3636C21.3523 26.8821 21.4292 27.3177 21.5831 27.6705C21.7393 28.0232 21.9571 28.2895 22.2365 28.4695C22.5159 28.6494 22.839 28.7393 23.206 28.7393C23.4119 28.7393 23.6025 28.7121 23.7777 28.6577C23.9553 28.6032 24.1127 28.5239 24.25 28.4197C24.3873 28.3132 24.5009 28.1842 24.5909 28.0327C24.6832 27.8812 24.7472 27.7083 24.7827 27.5142L26.3381 27.5213C26.2978 27.8551 26.1972 28.1771 26.0362 28.4872C25.8776 28.795 25.6634 29.0708 25.3935 29.3146C25.1259 29.5561 24.8063 29.7479 24.4347 29.8899C24.0653 30.0296 23.6475 30.0994 23.1811 30.0994C22.5324 30.0994 21.9524 29.9527 21.4411 29.6591C20.9321 29.3655 20.5296 28.9406 20.2337 28.3842C19.9401 27.8279 19.7933 27.1544 19.7933 26.3636C19.7933 25.5705 19.9425 24.8958 20.2408 24.3395C20.5391 23.7831 20.9439 23.3594 21.4553 23.0682C21.9666 22.7746 22.5419 22.6278 23.1811 22.6278C23.6025 22.6278 23.9931 22.687 24.353 22.8054C24.7152 22.9238 25.036 23.0966 25.3153 23.3239C25.5947 23.5488 25.822 23.8246 25.9972 24.1513C26.1747 24.478 26.2884 24.852 26.3381 25.2734Z'
                  fill='white'
                />
              </svg>
            ) : params?.row?.type === 'TXT' ? (
              <svg
                width='25'
                height='25'
                viewBox='0 0 40 40'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M7.75 4C7.75 2.20508 9.20508 0.75 11 0.75H27C27.1212 0.75 27.2375 0.798159 27.3232 0.883885L38.1161 11.6768C38.2018 11.7625 38.25 11.8788 38.25 12V36C38.25 37.7949 36.7949 39.25 35 39.25H11C9.20507 39.25 7.75 37.7949 7.75 36V4Z'
                  fill='white'
                  stroke='#D0D5DD'
                  strokeWidth='1.5'
                />
                <path
                  d='M27 0.5V8C27 10.2091 28.7909 12 31 12H38.5'
                  stroke='#D0D5DD'
                  strokeWidth='1.5'
                />
                <rect x='1' y='18' width='27' height='16' rx='2' fill='#344054' />
                <path
                  d='M4.60121 23.995V22.7273H10.5742V23.995H8.34766V30H6.82777V23.995H4.60121ZM12.9996 22.7273L14.4663 25.206H14.5231L15.9968 22.7273H17.7333L15.5138 26.3636L17.783 30H16.0146L14.5231 27.5178H14.4663L12.9748 30H11.2134L13.4897 26.3636L11.256 22.7273H12.9996ZM18.4293 23.995V22.7273H24.4023V23.995H22.1758V30H20.6559V23.995H18.4293Z'
                  fill='white'
                />
              </svg>
            ) : params?.row?.type === 'URL' ? (
              <svg
                width='25'
                height='25'
                viewBox='0 0 40 40'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M20 3.33325C25 6.66658 26.5379 13.82 26.6667 19.9999C26.5379 26.1799 25 33.3333 20 36.6666M20 3.33325C15 6.66659 13.4621 13.82 13.3333 19.9999C13.4621 26.1799 15 33.3333 20 36.6666M20 3.33325C10.7952 3.33325 3.33333 10.7952 3.33333 19.9999M20 3.33325C29.2047 3.33325 36.6667 10.7952 36.6667 19.9999M20 36.6666C29.2047 36.6666 36.6667 29.2047 36.6667 19.9999M20 36.6666C10.7953 36.6666 3.33333 29.2047 3.33333 19.9999M36.6667 19.9999C33.3333 24.9999 26.1799 26.5378 20 26.6666C13.8201 26.5378 6.66666 24.9999 3.33333 19.9999M36.6667 19.9999C33.3333 14.9999 26.1799 13.462 20 13.3333C13.8201 13.462 6.66666 14.9999 3.33333 19.9999'
                  stroke='#7F56D9'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            ) : (
              ''
            )}
            <div>
              <span className='px-4 font-medium font-extrabold !important'> {params.row.name}</span>{' '}
              <br />
              {params?.row?.type !== 'URL' && (
                <span className='px-4 font-medium'>{totalSizeKB.toFixed(2) + '  ' + 'KB'}</span>
              )}
            </div>
          </>
        )
      },
    },
    {
      field: 'accessType',
      headerName: 'Status',
      width: 300,
      sortable: false,
      filterable: false,
      headerClassName: 'hideRightSeparator',
      renderCell: (params: any) => {
        return (
          <>
            {params.row.isCompleted ? (
              <div className='flex justify-center border-2 border-[#DC6803] p-1 px-2 rounded-2xl'>
                <div className='text-[#DC6803]'>Processing</div>
                <div className='mt-1 pl-1'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='12'
                    height='12'
                    viewBox='0 0 12 12'
                    fill='none'
                  >
                    <g clip-path='url(#clip0_339_3090)'>
                      <path
                        d='M6 1V3M6 9V11M3 6H1M11 6H9M9.53921 9.53921L8.125 8.125M9.53921 2.49997L8.125 3.91418M2.46079 9.53921L3.875 8.125M2.46079 2.49997L3.875 3.91418'
                        stroke='#DC6803'
                        stroke-width='1.5'
                        stroke-linecap='round'
                        stroke-linejoin='round'
                      />
                    </g>
                    <defs>
                      <clipPath id='clip0_339_3090'>
                        <rect width='12' height='12' fill='white' />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
              </div>
            ) : (
              <div className='flex justify-center border-2 border-[#079455] p-1 px-2 rounded-2xl'>
                <div className='text-[#079455]'>Completed</div>
                <div className='mt-1 pl-1'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='13'
                    height='12'
                    viewBox='0 0 13 12'
                    fill='none'
                  >
                    <path
                      d='M10.5 3L5 8.5L2.5 6'
                      stroke='#079455'
                      stroke-width='1.5'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                    />
                  </svg>
                </div>
              </div>
            )}
          </>
        )
      },
    },
  ]

  let get_datas: any = []
  const marketingdoc = (checkboxs: any) => {
    get_datas = []
    selectionModel?.map((item) => {
      let x = {
        id: item,
      }
      get_id.push(x)
    })

    let get_item = getelect?.filter((x: any) => {
      return x.id != crmid
    })
    if (get_item?.length > 0) {
      get_datas = [...get_item]
    } else {
      get_datas = []
    }
    let get_data: any = []
    if (get_datas?.length > 0) {
      get_data = [
        ...get_datas,
        {
          id: Number(crmid),
          documents: get_id,
        },
      ]
    } else {
      get_data = [
        {
          id: Number(crmid),
          documents: get_id,
        },
      ]
    }

    sessionStorage.setItem('sessionVault', JSON.stringify(get_data))
    navigateTo(`/app/selectsource/${id}`, { state: [checkboxs, name] })
  }

  // SEARCH
  const onSearch = (e: any) => {}

  let checkboxlength: any =
    totalSelectedCheckboxes?.length == CrmMarketing?.length
      ? 'All'
      : totalSelectedCheckboxes?.length

  return (
    <>
      <div className='bg-[#0C111D] w-full h:32 lg:h-24 2xl=[60rem] lg:pb-4'>
        <div className='lg:relative'>
          <div className='lg:inline-flex'>
            <div className='lg:ml-3 lg:pt-3'>
              <div className='p-1 relative inline-flex lg:top-0 lg:pt-0 pt-2'>
                <div className='relative flex flex-wrap items-stretch'>
                  <input
                    onChange={(e) => onSearch(e)}
                    type='search'
                    className='relative lg:ml-0 block w-80 flex-auto rounded-l-lg p-1.5 border-t border-l border-b border-solid
                    bg-white text-base font-normal leading-[1.6]'
                    placeholder='Search for a datavault'
                    aria-label='Search'
                    aria-describedby='button-addon2'
                  />
                  <button
                    className='input-group-text bg-white w-10 flex p-1.5 items-center border-t border-b border-r border-solid border-neutral-300 whitespace-nowrap rounded-r-lg px-3 py-1.5 text-center text-base font-normal text-neutral-700'
                    id='basic-addon2'
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='20'
                      height='20'
                      viewBox='0 0 20 20'
                      fill='none'
                    >
                      <path
                        d='M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z'
                        stroke='#475467'
                        strokeWidth='1.66667'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <nav className='flex-no-wrap lg:pt-0 pt-20 relative flex w-full items-center justify-between lg:py-0 py-2 lg:flex-wrap lg:justify-start lg:pt-0'>
          <div className='flex w-full flex-wrap items-center justify-between lg:px-0 px-2'>
            <div
              className='sm:block flex-grow basis-[100%] items-center lg:!flex lg:basis-auto'
              id='navbarSupportedContent1'
              data-te-collapse-item
            >
              {totalSelectedCheckboxes.length > 0 && (
                <p className='lg:ml-4 ml-6 lg:top-50 text-white font-medium'>
                  {CrmMarketing.length +
                    ' Resource(s) found ' +
                    ' , ' +
                    checkboxlength +
                    '    ' +
                    'selected'}
                </p>
              )}
            </div>
            <div
              className='relative flex text-[#667085] items-center'
              data-te-dropdown-ref
              data-te-dropdown-alignment='end'
            >
              <p className='pt-10 lg:pt-0'></p>
              <button
                className='w-37 bg-white lg:mr-5 mt-2 text-sm font-semibold py-1 lg:px-3 px-4 border border-emerald-500 text-emerald-900 rounded-lg shadow disabled:opacity-25'
                onClick={() => marketingdoc(message)}
              >
                Add to Chat
              </button>
            </div>
          </div>
        </nav>
      </div>
      <div>
        <Box
          sx={{
            height: 340,
            width: '100%',
            '& .super-app-theme--header': {
              backgroundColor: '#32435A',
              color: '#FFFFFF',
              zIndex: -2,
            },
            '.css-1omg972-MuiDataGrid-root .MuiDataGrid-columnHeader--alignCenter .MuiDataGrid-columnHeaderTitleContainer':
              {
                backgroundColor: '#808080',
              },
            '.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
              outline: 'none !important',
            },
            noFocusOutline: {
              '& .MuiDataGrid-row:focus, & .MuiDataGrid-row.Mui-selected': {
                outline: 'none !important',
              },
            },
            '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus': {
              outline: 'none !important',
            },
            '.MuiDataGrid-root .MuiDataGrid-cell:focus': {
              outline: 'none !important',
            },
            '  .css-yrdy0g-MuiDataGrid-columnHeaderRow': {
              backgroundColor: '#808080',
              color: '#FFFFFF',
              border: 'none',
              paddingRight: '1rem',
            },
            '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
              outline: 'none !important',
            },
            '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus, &.MuiDataGrid-root .MuiDataGrid-cell:focus':
              {
                outline: 'none',
              },
            '& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-cell:focus-within': {
              outline: 'none',
            },
            '.MuiCheckbox-colorPrimary.Mui-checked': {
              color: ' white !important',
            },
            '.MuiCheckbox-colorPrimary': {
              color: ' white !important',
            },
            '.css-rtrcn9-MuiTablePagination-root .MuiTablePagination-selectLabel': {
              // display: 'none',
              color: 'white !important',
            },
            '.css-194a1fa-MuiSelect-select-MuiInputBase-input.css-194a1fa-MuiSelect-select-MuiInputBase-input.css-194a1fa-MuiSelect-select-MuiInputBase-input':
              {
                color: 'white !important',
              },
            '.MuiTablePagination-displayedRows': {
              color: 'white !important',
            },
            '.MuiTablePagination-root .MuiTablePagination-actions button svg': {
              fill: 'white !important',
            },
            '.MuiPagination-root .MuiPaginationSelect-icon': {
              color: 'white !important',
            },
            ' .MuiTablePagination-root .MuiSelect-icon': {
              color: 'white !important',
            },
          }}
        >
          <DataGrid
            sx={{
              boxShadow: 3,
              borderRadius: 100,
              m: 2,
              color: 'white',
              marginTop: 4,
              border: 'none',
              height: { md: height - 70, lg: height - 150, xl: height - 200 },
              '&>.MuiDataGrid-main': {
                '&>.MuiDataGrid-columnHeaders': {
                  borderBottom: '1px solid #32435A',
                },
                borderRadius:"12px",
                border: "1px solid #32435A"
              },
              '.MuiDataGrid-footerContainer': {
                border: 'none !important',
              },
              '.MuiPagination-ul': {
                justifyContent: 'center',
                display: 'none',
              },
              '& .MuiDataGrid-row': {
                border: '1px solid #32435A',
              },
              '& .MuiDataGrid-columnHeader:first-child .MuiDataGrid-columnSeparator': {
                display: 'none',
              },
              '& .hideRightSeparator > .MuiDataGrid-columnSeparator': {
                display: 'none',
              },
              '& .super-app-theme--header': {
                backgroundColor: '#808080',
                color: '#FFFFFF',
              },
              '.css-1omg972-MuiDataGrid-root .MuiDataGrid-columnHeader--alignCenter .MuiDataGrid-columnHeaderTitleContainer':
                {
                  backgroundColor: '#808080',
                },
              '.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
                outline: 'none !important',
              },
              noFocusOutline: {
                '& .MuiDataGrid-row:focus, & .MuiDataGrid-row.Mui-selected': {
                  outline: 'none !important',
                },
              },
              '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus': {
                outline: 'none !important',
              },
              '.MuiDataGrid-root .MuiDataGrid-cell:focus': {
                outline: 'none !important',
              },
              '  .css-yrdy0g-MuiDataGrid-columnHeaderRow': {
                backgroundColor: '#32435A',
                color: '#FFFFFF',
                border: 'none',
                paddingRight: '1rem',
              },
              '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
                outline: 'none !important',
              },
              '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus, &.MuiDataGrid-root .MuiDataGrid-cell:focus':
                {
                  outline: 'none',
                },
            }}
            // autoHeight
            rows={NewtestValue.length > 0 ? NewtestValue : CrmMarketing ? CrmMarketing : []}
            columns={columns}
            checkboxSelection
            selectionModel={selectionModel}
            onSelectionModelChange={(ids: any) => {
              setSelectionModel(ids)
              statevariable = false
              variable = true
              const selectedIDs = new Set(ids)
              const selectedRowData = CrmMarketing?.filter((CrmMarketing: any) =>
                selectedIDs.has(CrmMarketing?.id),
              )
              if (selectedRowData) {
                setTotalSelectedCheckboxes(selectedRowData)
                setMessage(selectedRowData)
              }
            }}
            components={{
              NoRowsOverlay: CustomNoRowsOverlay,
            }}
            hideFooterSelectedRowCount
            disableColumnMenu
            disableColumnFilter
            disableColumnSelector
            classes={{
              columnHeadersInner: 'custom-data-grid-columnHeadersInner',
              sortIcon: 'custom-data-grid-sortIcon',
              footerContainer: 'custom-data-grid-footerContainer',
            }}
          />
        </Box>
      </div>
    </>
  )
}
