import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt'
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt'
import GraphicEqIcon from '@mui/icons-material/GraphicEq'
import './PromptQuery.css'
import moment from 'moment'

export default function PromptQuery(props: any) {
  const { onClick } = props

  const todayDate = moment().format('D-MM-YYYY')
  const yesterdayDate = moment().subtract(1, 'days').format('D-MM-YYYY')

  return (
    <div>
      <div>
        <>
          {props.loader === true ? (
            <>
              <div className='loader'></div>
            </>
          ) : (
            <>
              {props?.message?.map((item: any) => (
                <Box key={item} sx={{ flexGrow: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={8}>
                      <Box></Box>
                    </Grid>
                    {moment(item.timestamp).format('D-MM-YYYY') == todayDate ? (
                      <>
                        <Grid item xs={4}>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              marginTop: '45px',
                            }}
                          >
                            <p className='text-sm font-medium text-gray-500  '>you</p>
                            <div className='text-sm '>{todayDate}</div>
                          </div>

                          <Box
                            sx={{
                              backgroundColor: '#054D80',
                              color: '#fff',
                              wordBreak: 'break-word',
                              wordWrap: 'break-word',
                              padding: '15px',
                              borderRadius: '5px',
                            }}
                          >
                            <Typography
                              sx={{ fontSize: '16px' }}
                              dangerouslySetInnerHTML={{
                                __html: item.prompt?.split('\n').join('<br/>'),
                              }}
                            ></Typography>
                          </Box>
                        </Grid>
                      </>
                    ) : moment(item.timestamp).format('D-MM-YYYY') == yesterdayDate ? (
                      <>
                        <Grid item xs={4}>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              marginTop: '45px',
                            }}
                          >
                            <p className='text-sm font-medium text-gray-500  '>you</p>
                            <div className='text-sm'>{yesterdayDate}</div>
                          </div>
                          <Box
                            sx={{
                              backgroundColor: '#054D80',
                              color: '#fff',
                              wordBreak: 'break-word',
                              wordWrap: 'break-word',
                              padding: '15px',
                              borderRadius: '5px',
                            }}
                          >
                            <Typography
                              sx={{ fontSize: '16px' }}
                              dangerouslySetInnerHTML={{
                                __html: item.prompt?.split('\n').join('<br/>'),
                              }}
                            ></Typography>
                          </Box>
                        </Grid>
                      </>
                    ) : moment(item.timestamp).format('D-MM-YYYY') !== yesterdayDate &&
                      moment(item.timestamp).format('D-MM-YYYY') !== todayDate ? (
                      <>
                        <Grid item xs={4}>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              marginTop: '45px',
                            }}
                          >
                            <p className='text-sm font-medium text-gray-500  '>you</p>
                            <p className='text-sm font-medium text-gray-500  '>Last Seven Days</p>
                          </div>
                          <Box
                            sx={{
                              backgroundColor: '#054D80',
                              color: '#fff',
                              wordBreak: 'break-word',
                              wordWrap: 'break-word',
                              padding: '15px',
                              borderRadius: '5px',
                            }}
                          >
                            <Typography
                              sx={{ fontSize: '16px' }}
                              dangerouslySetInnerHTML={{
                                __html: item.prompt?.split('\n').join('<br/>'),
                              }}
                            ></Typography>
                          </Box>
                        </Grid>
                      </>
                    ) : null}

                    <Grid item xs={8}>
                      {item.response && moment(item.timestamp).format('D-MM-YYYY') == todayDate ? (
                        <>
                          <div className='mt-10'>
                            <div style={{ display: 'flex' }}>
                              <p className=''>
                                <GraphicEqIcon />
                              </p>
                              <p className='text-sm font-medium text-gray-500  '>Bot</p>
                              <div className='ml-auto text-sm'>{todayDate}</div>
                            </div>
                            <Box
                              sx={{
                                backgroundColor: '#1D2939',
                                color: '#fff',
                                wordBreak: 'break-word',
                                wordWrap: 'break-word',
                                padding: '15px',
                                borderRadius: '5px',
                                marginLeft: '20px',
                              }}
                            >
                              <Typography
                                sx={{ fontSize: '16px' }}
                                dangerouslySetInnerHTML={{
                                  __html: item.response?.split('\n').join('<br/>'),
                                }}
                              ></Typography>
                            </Box>
                          </div>
                        </>
                      ) : item.response &&
                        moment(item.timestamp).format('D-MM-YYYY') == yesterdayDate ? (
                        <>
                          <div className='mt-10'>
                            <div style={{ display: 'flex' }}>
                              <p className=''>
                                <GraphicEqIcon />
                              </p>
                              <p className='text-sm font-medium text-gray-500  '>Bot</p>
                              <div className='ml-auto '>{yesterdayDate}</div>
                            </div>
                            <Box
                              sx={{
                                backgroundColor: '#1D2939',
                                color: '#fff',
                                wordBreak: 'break-word',
                                wordWrap: 'break-word',
                                padding: '15px',
                                borderRadius: '5px',
                                marginLeft: '20px',
                              }}
                            >
                              <Typography
                                sx={{ fontSize: '16px' }}
                                dangerouslySetInnerHTML={{
                                  __html: item.response?.split('\n').join('<br/>'),
                                }}
                              ></Typography>
                            </Box>
                          </div>
                        </>
                      ) : item.response &&
                        moment(item.timestamp).format('D-MM-YYYY') !== yesterdayDate &&
                        moment(item.timestamp).format('D-MM-YYYY') !== todayDate ? (
                        <>
                          <div className='mt-10'>
                            <div style={{ display: 'flex' }}>
                              <p className=''>
                                <GraphicEqIcon />
                              </p>
                              <p className='text-sm font-medium text-gray-500  '>Bot</p>
                              <p className='text-sm font-medium text-gray-500  ml-auto'>
                                Last Seven Days
                              </p>
                            </div>
                            <Box
                              sx={{
                                backgroundColor: '#1D2939',
                                color: '#fff',
                                wordBreak: 'break-word',
                                wordWrap: 'break-word',
                                padding: '15px',
                                borderRadius: '5px',
                                marginLeft: '20px',
                              }}
                            >
                              <Typography
                                sx={{ fontSize: '16px' }}
                                dangerouslySetInnerHTML={{
                                  __html: item.response?.split('\n').join('<br/>'),
                                }}
                              ></Typography>
                            </Box>
                          </div>
                        </>
                      ) : null}
                      {item.response == null ? (
                        <>
                          <div style={{ display: 'flex' }}>
                            <p className=''>
                              <GraphicEqIcon />
                            </p>
                            <p className='text-sm font-medium text-gray-500  '>Bot</p>
                          </div>
                          <Box
                            sx={{
                              backgroundColor: '#1D2939',
                              color: '#fff',
                              wordBreak: 'break-word',
                              wordWrap: 'break-word',
                              padding: '15px',
                              borderRadius: '5px',
                              fontSize: '5px',
                              // marginTop: "45px",
                              marginLeft: '20px',
                            }}
                          >
                            <Typography sx={{ fontSize: '16px' }}>
                              Sorry.. we have some network Issue!
                            </Typography>
                          </Box>
                        </>
                      ) : (
                        ''
                      )}
                      {item.response ? (
                        <div className='flex p-2 ml-4'>
                          <div onClick={() => onClick(item.responseId, 'up')}>
                            {item.liked ? (
                              <ThumbUpIcon style={{ color: 'white' }} />
                            ) : (
                              <ThumbUpOffAltIcon style={{ color: 'white' }} />
                            )}
                          </div>
                          <div className='px-2' onClick={() => onClick(item.responseId, 'down')}>
                            {item.disliked ? (
                              <ThumbDownAltIcon style={{ color: 'white' }} />
                            ) : (
                              <ThumbDownOffAltIcon style={{ color: 'white' }} />
                            )}
                          </div>
                        </div>
                      ) : (
                        ''
                      )}
                    </Grid>
                    <Grid item xs={4}>
                      <Box></Box>
                    </Grid>
                  </Grid>
                </Box>
              ))}

              {props?.question && (
                <Box sx={{ flexGrow: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={8}>
                      <Box></Box>
                    </Grid>
                    <Grid item xs={4}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p className='text-sm font-medium text-gray-500'>you</p>
                        <div>{todayDate}</div>
                      </div>
                      <Box
                        sx={{
                          backgroundColor: 'rgb(19, 80, 86)',
                          color: '#fff',
                          wordBreak: 'break-word',
                          wordWrap: 'break-word',
                          padding: '15px',
                          borderRadius: '5px',
                        }}
                      >
                        <Typography
                          sx={{ fontSize: '16px' }}
                          dangerouslySetInnerHTML={{
                            __html: props?.question?.split('\n').join('<br/>'),
                          }}
                        ></Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={8}>
                      <div className='bouncing-loader'>
                        <div></div>
                        <div></div>
                        <div></div>
                      </div>
                    </Grid>
                    <Grid item xs={4}>
                      <Box></Box>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </>
          )}
        </>
      </div>
    </div>
  )
}
