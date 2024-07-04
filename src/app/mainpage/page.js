'use client'
import axios from 'axios';
import React from 'react'
import { useRouter } from 'next/navigation';
import toast, {Toaster} from 'react-hot-toast';

import { useEffect,useRef,useState } from "react";
import './index.css'
import Comp from "./components/Comp";
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {TableRow, TableCell, Collapse, IconButton} from "@mui/material";
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import dayjs from "dayjs";
import DetectedPopup from "./components/DetectedPopup";
import ActivatePopup from "./components/ActivatePopup";
import ReactPaginate from 'react-paginate';

export default function Home() {

  const router = useRouter();

  const [show1,setShow1] = useState(false);
  const [show2,setShow2] = useState(false);

  const [open, setOpen] = useState(-1);

  const [searchSO,setSearchSO] = useState('');
  const [prodType,setProdType] = useState('');
  const [custName,setCustName] = useState('');
  const [lotno,setLotno] = useState('');
  const [delTime,setDelTime] = useState('');
  const [date,setDate] = useState('');
  const [date1,setDate1] = useState('');

  const pdfRef = useRef(null);

  const [startRange,setStartRange] = useState('');
  const [endRange,setEndRange] = useState('');

  let sday = startRange.split('-')[0];
  let smon = startRange.split('-')[1];
  let syear = startRange.split('-')[2];

  let eday = endRange.split('-')[0];
  let emon = endRange.split('-')[1];
  let eyear = endRange.split('-')[2];

  // console.log("day: ",sday," mon: ",smon," year: ",syear)

  let year = date.split('-')[0];
  let mon = date.split('-')[1];
  let day = date.split('-')[2];
  
  let year1 = date1.split('-')[0];
  let mon1 = date1.split('-')[1];
  let day1 = date1.split('-')[2];


  const[trial,setTrial] = useState([]);
  useEffect(()=>{
    async function getPageData(){
      const apiUrl = `http://localhost:3000/api`;
      const response = await fetch(apiUrl);
      const res = await response.json();
      // console.log(res[0][0]); 
      setTrial(res[0]);
    }
    getPageData();
  },[]);

  function buttonClear(){
    setSearchSO("");
    setProdType("");
    setCustName("");
    setLotno("");
    setDelTime("");
    setDate("");
    setStartRange("");
    setEndRange("");
    setDate1("");
    year="";
    mon="";
    day="";
    sday="";
    smon="";
    syear="";
    eday="";
    emon="";
    eyear="";
    year1="";
    mon1="";
    day1="";

    let inputs = document.querySelectorAll('input');
    inputs.forEach(input=>input.value='');
  }


  function clickedFunc2(){
    setShow2(!show2);
  }

  function toExcel(){
    let data = document.getElementById('tabledata');
    let fp = XLSX.utils.table_to_book(data,{sheet:'sheet1'});
    XLSX.write(fp,{
        bookType:'xlsx',
        type:'base64'
    });
    XLSX.writeFile(fp,"FlyApp.xlsx");
  }

  const genPdf = async () => {
    const inputdata = pdfRef.current;
    try{
      const canvas = await html2canvas(inputdata);
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit:"px",
        format:"a4",
      });
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, width, height);
      pdf.save("FlyApp.pdf");
    }catch(error){
      console.log(error);
    }
  }

  let colorx='';

    if(open != -1){
      colorx="#0a5c34e1";
   }
   else{
      colorx="#5727ac";
   }

   const logout = async () => {
    try{
      await axios.get('/api/users/logout')
      toast.success("Logout Successful")
      router.push("/login");
    }catch(error){
      console.log("Logout Error: ", error.message)
      toast.error("Logout Error")
    }
  }
  
  // function downloadPDF(){
  //   const input = pdfRef.current;
  //   html2canvas(input).then((canvas)=>{
  //     const imgData = canvas.toDataURL('image/png');
  //     const pdf = new jsPDF('p','mm','o4',true);
  //     const pdfWidth = pdf.internal.pageSize.getWidth();
  //     const pdfHeight = pdf.internal.pageSize.getHeight();
  //     const imgWidth = canvas.width;
  //     const imgHeight = canvas.height;
  //     const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
  //     const imgX = (pdfWidth - imgWidth * ratio) / 2;
  //     const imgY = 30;
  //     pdf.addImage(imgData, 'PNG', imgX,imgY,imgWidth*ratio,imgHeight*ratio);
  //     pdf.save('FlyApp.pdf');
  //   });
  // }

  const submitFunc=(searchTerm)=>{
    console.log('search ', searchTerm);
    
  }

  
  
    const [pageNumber, setPageNumber] = useState(0);
    const usersPerPage = 6;
    const pagesVisited = pageNumber * usersPerPage;
    const pageCount = Math.ceil(trial.length / usersPerPage) 

    const changePage = ({selected}) => {
      setPageNumber(selected)
    }

    const displayUsers = trial
    .slice(pagesVisited, pagesVisited + usersPerPage)
    .filter((sale)=>{
      if(startRange === '')
      {
        return sale;
      }
      if(dayjs(sale.orderdate).get("date").toString() >= sday.toString() && dayjs(sale.orderdate).get("date").toString() <= eday.toString())
      {
        // return sale;
        if(dayjs(sale.orderdate).get("month").toString() >= (smon-1).toString() && dayjs(sale.orderdate).get("month").toString() <= (emon-1).toString())
        {
          // return sale;
          if(dayjs(sale.orderdate).get("year").toString() >= (syear) && dayjs(sale.orderdate).get("year").toString() <= (eyear))
          {
            return sale;
          }
        }
      }
    })
    .filter((sale)=>{
      if(date === '')
      {
        return sale;
      }
      else if(dayjs(date).format('DD/MM/YYYY').toString().includes(dayjs(sale.orderdate).format('DD/MM/YYYY').toString()))
      {
        return sale;
      }
    })
    .filter((sale)=>{
      if(date1 === '')
        {
          return sale;
        }
        else if(dayjs(date1).format('DD/MM/YYYY').toString().includes(dayjs(sale.orderdate).format('DD/MM/YYYY').toString()))
        {
          return sale;
        }
    })
    .filter((sale)=>{
      return searchSO === '' ? sale : sale.salesorder.includes(searchSO)
    })
    .filter((sale)=>{
      return prodType.toLowerCase() === '' ? sale : sale.productType.toLowerCase().includes(prodType)
    })
    .filter((sale)=>{
      return custName.toLowerCase() === '' ? sale : sale.customerName.toLowerCase().includes(custName)
    })
    .filter((sale)=>{
      return lotno.toString().toLowerCase() === '' ? sale : sale.lotNo.toString().includes(lotno)
    })
    .filter((sale)=>{
      return delTime.toString().toLowerCase() === '' ? sale : sale.deliveryTime.toString().includes(delTime)
    })
    .map((sale,index)=>{    
      let datex = new Date(sale.orderdate)
      if(dayjs(date).format('DD/MM/YYYY').toString().includes(dayjs(sale.orderdate).format('DD/MM/YYYY').toString()))
      console.log(dayjs(sale.orderdate).format('DD/MM/YYYY').toString())
      return( 
            <>
              <tr key={index}>
                  <td style={{borderTopLeftRadius:'10px',borderBottomLeftRadius:'10px'}} id="tabled">{sale.track}</td>
                  <td id="tabled" format='DD-MM-YYYY' style={{width:'90px'}}>{dayjs(sale.orderdate).format('DD/MM/YYYY')}</td> 
                  <td id="tabled">{sale.houseLocation}</td>
                  <td id="tabled"><span style={{backgroundColor:'#0a5c34e1',borderRadius:'3px',paddingTop:'5px',paddingBottom:'5px',color:'white',paddingLeft:'5px',paddingRight:'5px'}}>{sale.salesorder}</span></td>
                  <td id="tabled">{sale.customerName}</td>
                  <td id="tabled">{sale.productType}</td>
                  <td id="tabled">{sale.qty}</td>
                  <td id="tabled">{sale.prePack}</td>
                  <td id="tabled"><DetectedPopup qrs={sale.detectedQrs}/></td>
                  <td id="tabled"><ActivatePopup qrs={sale.activateQrs}/></td>
                  <td id="tabled">{sale.lotNo}</td>
                  <td id="tabled"><span style={{backgroundColor:`${colorx}`,borderRadius:'3px',paddingTop:'5px',paddingBottom:'5px',color:'white',paddingLeft:'25px',paddingRight:'25px'}}>{sale.deliveryTime}</span></td>
                  <td id="tabled" style={{fontWeight:'bold'}}>{sale.scannedApps}</td>
                  
                  <TableCell sx={{border:'1.5px solid white',borderTopRightRadius:'10px',borderBottomRightRadius:'10px'}}>
                    <button className="tablebtn" style={{color:'white',fontWeight:'bold',width:'65px'}}>
                      <IconButton aria-label="expand row" size="small" onClick={() => setOpen(open === index ? -1 : index)}> <span  style={{fontSize:'13px',color:'white',position:'relative',bottom:'2px'}}>Track</span>
                              {open === index ? (
                                <span style={{color:'white',paddingTop:'3px',paddingLeft:'5px',fontSize:'12px',background:'rgb(236, 145, 0)',width:'70px',right:'40px',height:'25px',top:'-5px',borderRadius:'4px',position:'relative',bottom:'2px'}}>Track <ArrowDropUpOutlinedIcon sx={{color:'white',height:'20px',position:'relative',bottom:'2px'}}/> </span>
                                
                              ) : (
                                <span style={{color:'white',paddingTop:'3px',paddingLeft:'5px',fontSize:'12px',background:'#1f9090',width:'70px',right:'40px',height:'25px',top:'-5px',borderRadius:'4px',position:'relative',bottom:'2px'}}>Track <ArrowDropDownOutlinedIcon sx={{color:'white',height:'20px',position:'relative',bottom:'2px'}}/> </span>
                              )}
                      </IconButton>
                      </button>
                  </TableCell>                      
              </tr>
              <tr>
                    <Collapse in={open === index} timeout="auto" sx={{width:'50px',backgroundColor:'rgb(233, 272, 233)', border:'0px solid rgb(233, 272, 233)'}} unmountOnExit>
                      <Comp  customer={sale.customerName} house={sale.houseLocation} product={sale.productType} order={sale.orderdate} track={sale.track}/>
                    </Collapse>
              </tr>
              
          </>
      );
      
   }) 






  return (
    <>
    <Toaster/>
    <div ref={pdfRef}>
        <nav>
            <div className="nav-logo">
                <img src="#" alt="#"/>
            </div>
            <div className="company-name">Fly<span className="nav-span">App</span></div> 
            <button className="poweroff" onClick={logout}>&#x2B58;</button>   
        </nav>

        <div className="searchplace">
        
            <p style={{color:'#0d5543', position:'absolute', top:'55px',left:'6px',fontWeight:'600'}}>Please enter SO Number</p>

            <div className="export-div">
                <p style={{marginRight:'8px', fontWeight:'bold',position:'relative',top:'1px',fontSize:'11px'}}>Export</p>
                <button className="img-btn" id="img-btn1" onClick={()=>genPdf()}>
                    <svg className="pdfsvg" xmlns="http://www.w3.org/2000/svg" viewBox="-250 0 884 512"><path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 144-208 0c-35.3 0-64 28.7-64 64l0 144-48 0c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128zM176 352l32 0c30.9 0 56 25.1 56 56s-25.1 56-56 56l-16 0 0 32c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-48 0-80c0-8.8 7.2-16 16-16zm32 80c13.3 0 24-10.7 24-24s-10.7-24-24-24l-16 0 0 48 16 0zm96-80l32 0c26.5 0 48 21.5 48 48l0 64c0 26.5-21.5 48-48 48l-32 0c-8.8 0-16-7.2-16-16l0-128c0-8.8 7.2-16 16-16zm32 128c8.8 0 16-7.2 16-16l0-64c0-8.8-7.2-16-16-16l-16 0 0 96 16 0zm80-112c0-8.8 7.2-16 16-16l48 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0 0 32 32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0 0 48c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-64 0-64z"/></svg>
                </button>
                <button className="img-btn" id="img-btn2" onClick={()=>toExcel()}>
                    <svg className="xcelsvg" xmlns="http://www.w3.org/2000/svg" viewBox="-250 0 884 512"><path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM155.7 250.2L192 302.1l36.3-51.9c7.6-10.9 22.6-13.5 33.4-5.9s13.5 22.6 5.9 33.4L221.3 344l46.4 66.2c7.6 10.9 5 25.8-5.9 33.4s-25.8 5-33.4-5.9L192 385.8l-36.3 51.9c-7.6 10.9-22.6 13.5-33.4 5.9s-13.5-22.6-5.9-33.4L162.7 344l-46.4-66.2c-7.6-10.9-5-25.8 5.9-33.4s25.8-5 33.4 5.9z"/></svg>
                </button>
                <div className="vertical-line"></div>
            </div>
        </div>
        <button className="filterf-btn" >Filter</button>
        <button className="srch-btn" onClick={()=>submitFunc(searchSO)}>Search</button>
        <input className="soid-inp" type="text" value={searchSO} onChange={(e)=> setSearchSO(e.target.value)} placeholder="Search SO ID..."/>
        <input className="date-inp" type="date" onChange={(e)=>setDate(e.target.value)}/>
        <div className="search-div">
            <div className="search-divs">Date<input onChange={(e)=> setDate1(e.target.value)} id="search-inp" type="date"/></div>
            <div className="search-divs">Date Range<input onChange={(e)=> setStartRange(e.target.value)} id="search-inp" placeholder="From" type="text"/></div>
            <div className="search-divs" style={{position:'relative',top:'16px'}}><input onChange={(e)=> setEndRange(e.target.value)} id="search-inp" placeholder="To" type="text"/></div>
            <div className="search-divs">Type of Product<input id="search-inp" placeholder="All" onChange={(e)=> setProdType(e.target.value)}/></div>
            <div className="search-divs">Customer Name<input id="search-inp" onChange={(e)=>setCustName(e.target.value)}/></div>
            <div className="search-divs">Lot Number<input id="search-inp" onChange={(e)=>setLotno(e.target.value)}/></div>
            <div className="search-divs">Delivery Time<input id="search-inp" placeholder="All" onChange={(e)=>setDelTime(e.target.value)}/></div>

            <button id="clear-filter" onClick={()=>buttonClear()}>Clear filter</button>
        </div>
        

  {/*   */}
  
  <table id="tabledata" style={{background:'rgb(233, 272, 233)'}}>
    <tbody>
        <tr>
            <th  id="color1" style={{width:'40px'}}>S.No.</th>
            <th  id="color1">Sales order Date</th>
            <th  id="color2">Packing House Location</th>
            <th  id="color3" style={{width:'120px'}}>Sales Order</th>
            <th  id="color3" style={{width:'140px'}}>Customer Name</th>
            <th  id="color4" style={{width:'80px'}}>Type of Product</th>
            <th  id="color4" style={{width:'50px'}}>Qty(Kg)</th>
            <th  id="color4" style={{width:'70px'}}>#Pre packs</th>
            <th  id="color5">Detected QRs</th>
            <th  id="color5" style={{width:'90px'}}>Successfully Activated QRs</th>
            <th  id="color5" style={{width:'120px'}}>Lot Number</th>
            <th  id="color2">Total Delivery Time(HRS)</th>
            <th  id="color6" style={{width:'100px'}}>Scanned with Installed Silal App</th>
            <th  id="color7"></th>
        </tr>  
        {displayUsers}

        {/* WITH DATABASE CONNECTION FROM MYSQL */}
        {/* .filter((sale)=>{
          return date === '' ? sale : ((day === '' ? sale : sale.orderdate.substring(0,10).split('-')[2].includes(day)) && (mon === '' ? sale : sale.orderdate.substring(0,10).split('-')[1].includes(mon)) || (year === '' ? sale : sale.orderdate.substring(0,10).split('-')[0].includes(year)) );
        }) */}
        
{/*     
    { 
        trial.filter((sale)=>{
          if(startRange === '')
          {
            return sale;
          }
          if(dayjs(sale.orderdate).get("date").toString() >= sday.toString() && dayjs(sale.orderdate).get("date").toString() <= eday.toString())
          {
            // return sale;
            if(dayjs(sale.orderdate).get("month").toString() >= (smon-1).toString() && dayjs(sale.orderdate).get("month").toString() <= (emon-1).toString())
            {
              // return sale;
              if(dayjs(sale.orderdate).get("year").toString() >= (syear) && dayjs(sale.orderdate).get("year").toString() <= (eyear))
              {
                return sale;
              }
            }
          }
        }).filter((sale)=>{
          if(date === '')
          {
            return sale;
          }
          else if(dayjs(date).format('DD/MM/YYYY').toString().includes(dayjs(sale.orderdate).format('DD/MM/YYYY').toString()))
          {
            return sale;
          }
        }).filter((sale)=>{
          if(date1 === '')
            {
              return sale;
            }
            else if(dayjs(date1).format('DD/MM/YYYY').toString().includes(dayjs(sale.orderdate).format('DD/MM/YYYY').toString()))
            {
              return sale;
            }
        }).filter((sale)=>{
          return searchSO === '' ? sale : sale.salesorder.includes(searchSO)
        }).filter((sale)=>{
          return prodType.toLowerCase() === '' ? sale : sale.productType.toLowerCase().includes(prodType)
        }).filter((sale)=>{
          return custName.toLowerCase() === '' ? sale : sale.customerName.toLowerCase().includes(custName)
        }).filter((sale)=>{
          return lotno.toString().toLowerCase() === '' ? sale : sale.lotNo.toString().includes(lotno)
        }).filter((sale)=>{
          return delTime.toString().toLowerCase() === '' ? sale : sale.deliveryTime.toString().includes(delTime)
        }).map((sale,index)=>{    
          let datex = new Date(sale.orderdate)
          if(dayjs(date).format('DD/MM/YYYY').toString().includes(dayjs(sale.orderdate).format('DD/MM/YYYY').toString()))
          console.log(dayjs(sale.orderdate).format('DD/MM/YYYY').toString())
          return( 
                <>
                  <tr key={index}>
                      <td style={{borderTopLeftRadius:'10px',borderBottomLeftRadius:'10px'}} id="tabled">{sale.track}</td>
                      <td id="tabled" format='DD-MM-YYYY' style={{width:'90px'}}>{dayjs(sale.orderdate).format('DD/MM/YYYY')}</td> 
                      <td id="tabled">{sale.houseLocation}</td>
                      <td id="tabled"><span style={{backgroundColor:'#0a5c34e1',borderRadius:'3px',paddingTop:'5px',paddingBottom:'5px',color:'white',paddingLeft:'5px',paddingRight:'5px'}}>{sale.salesorder}</span></td>
                      <td id="tabled">{sale.customerName}</td>
                      <td id="tabled">{sale.productType}</td>
                      <td id="tabled">{sale.qty}</td>
                      <td id="tabled">{sale.prePack}</td>
                      <td id="tabled"><DetectedPopup qrs={sale.detectedQrs}/></td>
                      <td id="tabled"><ActivatePopup qrs={sale.activateQrs}/></td>
                      <td id="tabled">{sale.lotNo}</td>
                      <td id="tabled"><span style={{backgroundColor:`${colorx}`,borderRadius:'3px',paddingTop:'5px',paddingBottom:'5px',color:'white',paddingLeft:'25px',paddingRight:'25px'}}>{sale.deliveryTime}</span></td>
                      <td id="tabled" style={{fontWeight:'bold'}}>{sale.scannedApps}</td>
                      
                      <TableCell sx={{border:'1.5px solid white',borderTopRightRadius:'10px',borderBottomRightRadius:'10px'}}>
                        <button className="tablebtn" style={{color:'white',fontWeight:'bold',width:'65px'}}>
                          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(open === index ? -1 : index)}> <span  style={{fontSize:'13px',color:'white',position:'relative',bottom:'2px'}}>Track</span>
                                  {open === index ? (
                                    <span style={{color:'white',paddingTop:'3px',paddingLeft:'5px',fontSize:'12px',background:'rgb(236, 145, 0)',width:'70px',right:'40px',height:'25px',top:'-5px',borderRadius:'4px',position:'relative',bottom:'2px'}}>Track <ArrowDropUpOutlinedIcon sx={{color:'white',height:'20px',position:'relative',bottom:'2px'}}/> </span>
                                    
                                  ) : (
                                    <span style={{color:'white',paddingTop:'3px',paddingLeft:'5px',fontSize:'12px',background:'#1f9090',width:'70px',right:'40px',height:'25px',top:'-5px',borderRadius:'4px',position:'relative',bottom:'2px'}}>Track <ArrowDropDownOutlinedIcon sx={{color:'white',height:'20px',position:'relative',bottom:'2px'}}/> </span>
                                  )}
                          </IconButton>
                          </button>
                      </TableCell>                      
                  </tr>
                  <tr>
                        <Collapse in={open === index} timeout="auto" sx={{width:'50px',backgroundColor:'rgb(233, 272, 233)', border:'0px solid rgb(233, 272, 233)'}} unmountOnExit>
                          <Comp  customer={sale.customerName} house={sale.houseLocation} product={sale.productType} order={sale.orderdate} track={sale.track}/>
                        </Collapse>
                  </tr>
                  
              </>
          );
          
       }) 
    } */}


      

      

    {/* HARD CODED INPUT */}
    {/* <tr>
        <td>1</td>
        <td>03-09-2023</td>
        <td>Al Ain-Al</td>
        <td><span style={{backgroundColor:'#12765f',borderRadius:'3px',paddingTop:'5px',paddingBottom:'5px',color:'white',paddingLeft:'15px',paddingRight:'15px'}}>SO/2023/9/1668</span></td>
        <td>Abu Dhabi Coop</td>
        <td>Cucumber</td>
        <td>12</td>
        <td>25</td>
        <td>17</td>
        <td>25</td>
        <td>27368124</td>
        <td><span style={{backgroundColor:'#12765f',borderRadius:'3px',paddingTop:'5px',paddingBottom:'5px',color:'white',paddingLeft:'20px',paddingRight:'20px'}}>24</span></td>
        <td>2</td>
        <td><button onClick={()=>clickedFunc1()} class="tablebtn" style={{color:'black',fontWeight:'bold',width:'65px'}}>Track &#x3e;</button></td>
    </tr>
    {
      show1 && <Comp customer="Abu Dhabi Coop" house="Al Ain-Al" product="Cucumber" order="03-09-2023"/>
    }
    <tr>
        <td>2</td>
        <td>10-10-2022</td>
        <td>Maldives</td>
        <td><span style={{backgroundColor:'#12765f',borderRadius:'3px',paddingTop:'5px',paddingBottom:'5px',color:'white',paddingLeft:'15px',paddingRight:'15px'}}>S0/2022/12/3213</span></td>
        <td>Assdadsad</td>
        <td>Mushroom</td>
        <td>13</td>
        <td>20</td>
        <td>11</td>
        <td>21</td>
        <td>28369792</td>
        <td><span style={{backgroundColor:'#12765f',borderRadius:'3px',paddingTop:'5px',paddingBottom:'5px',color:'white',paddingLeft:'20px',paddingRight:'20px'}}>12</span></td>
        <td>5</td>
        <td><button onClick={()=>clickedFunc2()} class="tablebtn" style={{color:'black',fontWeight:'bold',width:'65px'}}>Track &#x3e;</button></td>
    </tr>
    {
      show2 && <Comp customer="Assdadsad" house="Maldives" product="Mushroom" order="10-10-2022"/>
    }
 */}
 
 </tbody>
    </table>
    
    
    <div className="pagination-div">
            <ReactPaginate 
              previousLabel={"<"}
              nextLabel={">"}
              pageCount={pageCount}
              onPageChange={changePage}
              containerClassName={"pagination"}
              activeClassName={"paginationActive"}
            />
    </div>
    
    
    </div>
    
    </>
  );

  

}
