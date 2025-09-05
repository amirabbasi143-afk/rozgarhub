import React, { useEffect, useState } from 'react'

const SAMPLE_JOBS = [
  {
    id: 1,
    type: 'Government',
    title: 'Assistant (PPSC)',
    organization: 'Punjab Public Service Commission',
    location: 'Lahore',
    salary: '40,000 - 60,000',
    datePosted: '2025-08-20',
    details: 'Apply online at PPSC. Eligibility: BA/BSc. Last date: 2025-09-10.'
  },
  {
    id: 2,
    type: 'Private',
    title: 'Software Developer',
    organization: 'Tech Solutions Pvt Ltd',
    location: 'Remote',
    salary: '60,000 - 120,000',
    datePosted: '2025-08-28',
    details: 'Full stack developer. Experience: 1-3 years.'
  }
]

const SAMPLE_ADMISSIONS = [
  {
    id: 1,
    program: 'BS Computer Science',
    university: 'National University',
    campus: 'Main Campus',
    intake: 'Fall 2025',
    lastDate: '2025-10-01',
    details: 'Merit-based admissions. Apply online.'
  }
]

function useLocalStorage(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : initial
    } catch (e) {
      return initial
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state))
    } catch (e) {}
  }, [key, state])
  return [state, setState]
}

export default function App() {
  const [jobs, setJobs] = useLocalStorage('rz_jobs', SAMPLE_JOBS)
  const [admissions, setAdmissions] = useLocalStorage('rz_admissions', SAMPLE_ADMISSIONS)

  const [view, setView] = useState('home') // home | jobs | admissions | add
  const [filter, setFilter] = useState('All')
  const [query, setQuery] = useState('')

  // form states for adding
  const [form, setForm] = useState({})

  function addJob(e) {
    e.preventDefault()
    const id = Date.now()
    const payload = { id, ...form }
    setJobs([payload, ...jobs])
    setForm({})
    setView('jobs')
  }

  function addAdmission(e) {
    e.preventDefault()
    const id = Date.now()
    const payload = { id, ...form }
    setAdmissions([payload, ...admissions])
    setForm({})
    setView('admissions')
  }

  function deleteJob(id) {
    if (!confirm('Are you sure to delete this job?')) return
    setJobs(jobs.filter(j => j.id !== id))
  }

  function filteredJobs() {
    let res = jobs
    if (filter !== 'All') res = res.filter(j => j.type === filter)
    if (query) res = res.filter(j => (j.title + j.organization + j.location).toLowerCase().includes(query.toLowerCase()))
    return res
  }

  return (
    <div style={{fontFamily: 'system-ui, sans-serif', padding: 16}}>
      <header style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div>
          <h1>RozgarHub Pakistan</h1>
          <p>Jobs, University Admissions & Career Resources</p>
        </div>
        <nav>
          <button onClick={() => setView('home')}>Home</button>{' '}
          <button onClick={() => setView('jobs')}>Jobs</button>{' '}
          <button onClick={() => setView('admissions')}>Admissions</button>{' '}
          <button onClick={() => setView('add')}>Post</button>
        </nav>
      </header>

      <main style={{marginTop: 20}}>
        {view === 'home' && (
          <div style={{display: 'flex', gap: 16}}>
            <div style={{flex: 2}}>
              <section style={{background: '#fff', padding: 12}}>
                <h2>Latest Jobs</h2>
                <ul>
                  {jobs.slice(0,5).map(job => (
                    <li key={job.id} style={{borderBottom: '1px solid #eee', padding: 8}}>
                      <strong>{job.title}</strong> — {job.organization}
                      <div style={{fontSize: 12, color: '#666'}}>{job.location} • {job.type} • Posted: {job.datePosted}</div>
                      <div style={{marginTop: 6}}>{job.details}</div>
                    </li>
                  ))}
                </ul>
              </section>

              <section style={{background: '#fff', padding: 12, marginTop: 12}}>
                <h2>Top Admissions</h2>
                <ul>
                  {admissions.slice(0,5).map(a => (
                    <li key={a.id} style={{borderBottom: '1px solid #eee', padding: 8}}>
                      <strong>{a.program}</strong> — {a.university}
                      <div style={{fontSize: 12, color: '#666'}}>Intake: {a.intake} • Last date: {a.lastDate}</div>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <aside style={{flex: 1}}>
              <div style={{background:'#fff', padding:12}}>
                <h3>Contact</h3>
                <div>Phone: 0306-7373441</div>
                <div>Email: amirabbasi143@gmail.com</div>
              </div>
            </aside>
          </div>
        )}

        {view === 'jobs' && (
          <section>
            <div style={{marginBottom:12}}>
              <select value={filter} onChange={e => setFilter(e.target.value)}>
                <option>All</option>
                <option>Government</option>
                <option>Private</option>
                <option>Education</option>
              </select>{' '}
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search jobs" />
              <button onClick={() => { setFilter('All'); setQuery('') }}>Clear</button>
            </div>

            <div>
              {filteredJobs().map(job => (
                <article key={job.id} style={{background:'#fff', padding:12, marginBottom:8}}>
                  <div style={{display:'flex', justifyContent:'space-between'}}>
                    <div>
                      <h3>{job.title}</h3>
                      <div style={{fontSize:12, color:'#666'}}>{job.organization} • {job.location} • {job.type}</div>
                      <p>{job.details}</p>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <div>{job.salary}</div>
                      <div style={{fontSize:11, color:'#999'}}>{job.datePosted}</div>
                      <button onClick={() => deleteJob(job.id)} style={{color:'red'}}>Delete</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {view === 'admissions' && (
          <section>
            <h2>Admissions & University Notices</h2>
            {admissions.map(a => (
              <div key={a.id} style={{background:'#fff', padding:12, marginBottom:8}}>
                <h3>{a.program} — {a.university}</h3>
                <div style={{fontSize:12, color:'#666'}}>{a.campus} • Intake: {a.intake} • Last date: {a.lastDate}</div>
                <p>{a.details}</p>
              </div>
            ))}
          </section>
        )}

        {view === 'add' && (
          <section>
            <h2>Post a Job or Admission</h2>
            <div style={{background:'#fff', padding:12}}>
              <div>
                <label>Select type</label>
                <select onChange={e => setForm({ ...form, postType: e.target.value })}>
                  <option value="job">Job</option>
                  <option value="admission">Admission</option>
                </select>
              </div>

              <form onSubmit={(e) => { (form.postType === 'admission') ? addAdmission(e) : addJob(e) }}>
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:8}}>
                  <input value={form.title || form.program || ''} onChange={e => setForm({ ...form, title: e.target.value, program: e.target.value })} placeholder="Title / Program" />
                  <input value={form.organization || form.university || ''} onChange={e => setForm({ ...form, organization: e.target.value, university: e.target.value })} placeholder="Organization / University" />
                </div>
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:8}}>
                  <input value={form.location || ''} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Location / Campus" />
                  <input value={form.salary || form.intake || ''} onChange={e => setForm({ ...form, salary: e.target.value, intake: e.target.value })} placeholder="Salary / Intake" />
                </div>
                <textarea value={form.details || ''} onChange={e => setForm({ ...form, details: e.target.value })} placeholder="Details (eligibility, how to apply, last date)" rows={4} style={{width:'100%', marginTop:8}}></textarea>

                <div style={{marginTop:8}}>
                  <button type="submit">Publish</button>{' '}
                  <button type="button" onClick={() => { setForm({}); setView('home') }}>Cancel</button>
                </div>
              </form>
            </div>
          </section>
        )}
      </main>

      <footer style={{marginTop:20}}>
        <div>
          <strong>RozgarHub Pakistan</strong>
          <div>Phone: 0306-7373441 • Email: amirabbasi143@gmail.com</div>
        </div>
      </footer>
    </div>
  )
}