import CreateClassRoom from '../../components/classroom/CreateClassroom'
import AddLearningOutcomes from '../../components/LearningOutcomes/AddLeadingOutcome'
import Questions from '../../components/Questions/Questions'
const Index =()=>{
    return(
        <div className="py-10 px-7">
            <div className='text-xl font-medium mb-10'>Super Admin Settings</div>
            <div role="tablist" className="tabs tabs-lifted w-full min-w-full">
            <input type="radio" name="my_tabs_2" role="tab" className="tab text-md" aria-label="Learning objectives" checked />
               <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
                <AddLearningOutcomes/>
                </div>

            <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="Questions"  />
                <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
                <Questions/>
                </div>

            {/* <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="Tab 3" />
                <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">Tab content 3</div> */}
</div>
        </div>
    )
}

export default Index