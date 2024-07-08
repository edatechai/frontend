import CreateClassRoom from '../../components/classroom/CreateClassroom'
const Index =()=>{
    return(
        <div className="py-10 px-7">
            <div className='text-xl font-medium mb-10'>School Settings</div>
            <div role="tablist" className="tabs tabs-lifted">
            <input type="radio" name="my_tabs_2" role="tab" className="tab text-md" aria-label="Class Room Settings" checked />
               <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
                <CreateClassRoom/>
                </div>

            {/* <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="Tab 2"  />
                <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">Tab content 2</div>

            <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="Tab 3" />
                <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">Tab content 3</div> */}
</div>
        </div>
    )
}

export default Index